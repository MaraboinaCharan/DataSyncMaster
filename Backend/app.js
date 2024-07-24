const express = require("express");
const bodyParser = require("body-parser");
const dbRoutes = require("./controllers/dbRoutes");
const schemaRoutes = require("./controllers/schemaRoutes");
const { fetchData } = require("./services/dbController");

const path = require("path");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/views", express.static(path.join(__dirname, "views")));
let exportdata = null;

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/", dbRoutes);
app.use("/", schemaRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/schema", (req, res) => {
  res.sendFile(__dirname + "/views/schema.html");
});

app.get("/schemavalue", (req, res) => {
  console.log({ schema1, schema2 });

  res.json({ schema1, schema2 });
});

app.post("/compareData", async (req, res) => {
  const { db1Query, db2Query, caseSensitive } = req.body;
  console.log(req.body, "from compare data route");

  try {
    let data1, data2;

    try {
      data1 = await fetchData("mysql", db1Query);
    } catch (error) {
      console.error("Error fetching data1:", error);
      return res
        .status(500)
        .json({ db1Error: "Internal server error while fetching data1" });
    }

    try {
      data2 = await fetchData("mysql", db2Query);
    } catch (error) {
      console.error("Error fetching data2:", error);
      return res
        .status(500)
        .json({ db2Error: "Internal server error while fetching data2" });
    }

    if (data1 === "Invalid Query") {
      return res
        .status(500)
        .json({ db1Error: "Invalid query for db1", db2Error: "No error" });
    }

    if (data2 === "Invalid Query") {
      return res
        .status(500)
        .json({ db1Error: "No error", db2Error: "Invalid query for db2" });
    }

    if (!data1 && !data2) {
      res.status(500).send("Invalid Query for database 1 and database 2");
      return;
    }
    if (!data1) {
      res.status(500).send("Invalid Query for database 1");
      return;
    }
    if (!data2) {
      res.status(500).send("Invalid Query for database 2");
      return;
    }

    if (data1 && data2) {
      exportdata = compareTables(data1, data2, caseSensitive);
      const response = {
        exportdata: exportdata,
        exportdataLength: exportdata.length,
      };
      console.log(response.exportdataLength);

      res.send(exportdata);
    } else {
      res
        .status(500)
        .json({
          error: "Data fetching error: One or more datasets are undefined",
        });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function compareTables(data1, data2, caseSensitive) {
  const differences = [];

  data1.forEach((row2) => {
    const matchingRow = data2.find((row1) =>
      isEqual(row1, row2, caseSensitive)
    );
    if (!matchingRow || !isEqual(row2, matchingRow, caseSensitive)) {
      differences.push(row2);
    }
  });

  return differences;
}
function isEqual(obj1, obj2, caseSensitive) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    let val1 = obj1[key];
    let val2 = obj2[key];

    if (
      caseSensitive == "true" &&
      typeof val1 === "string" &&
      typeof val2 === "string"
    ) {
      val1 = val1.toLowerCase();
      val2 = val2.toLowerCase();
    }

    if (val1 !== val2) {
      return false;
    }
  }

  return true;
}

app.get("/exportData", exportData);

async function exportData() {
  const table = exportdata;

  let csv = [];

  const rows = table.querySelectorAll("tr");
  rows.forEach((row) => {
    let rowData = [];

    row.querySelectorAll("td, th").forEach((cell) => {
      rowData.push(cell.textContent.trim());
    });

    csv.push(rowData.join(","));
  });

  csv = csv.join("\n");

  const blob = new Blob([csv], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "table_data.csv";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
