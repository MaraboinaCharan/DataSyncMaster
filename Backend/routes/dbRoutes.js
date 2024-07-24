// const express = require("express");
// const router = express.Router();
// const {
//   connectToDB,
//   fetchTableDetails,
// } = require("../controllers/dbController");

// router.post("/connect", connectToDB);
// router.post("/table-details", fetchTableDetails);

// module.exports = router;



const express = require("express");
const router = express.Router();
const {
  connectToDB,
  fetchTableDetails,
} = require("../controllers/dbController");

// router.post("/connect", async (req, res) => {
//   try {
//     await connectToDB(req, res);
//   } catch (error) {
//     // console.error("Error connecting to the database:");
//     res.status(500).send("Error connecting to the databases" );
//   }
// });


router.post("/connect", async (req, res) => {
  try {
    await connectToDB(req, res);
  } catch (error) {
    // if (error.message.includes("Invalid database credentials for Source")) {
      // res.status(500).send("Invalid credentials for Source");
      // return ;

    // } else if (error.message.includes("Invalid database credentials for Target")) {
      // res.status(500).send("Invalid credentials for Target");
      // return ;
    // } else {
    //   console.error("Error connecting to the databases:", error);
    //   res.status(500).send("Error connecting to the databases");
    //   // return ;
    // }
    console.log(error.message)

    if (error.message.includes("Invalid database credentials for Source")) {
      res.status(500).send("Invalid database credentials for Source");
    } else if (error.message.includes("Invalid database credentials for Target")) {
      res.status(500).send("Invalid database credentials for Target");
    }
  }
});


router.post("/table-details", async (req, res) => {
  try {
    await fetchTableDetails(req, res);
  } catch (error) {
    // console.error("Error fetching table details:", error);
    res.status(500).send("Error fetching schema " );
  }
});

module.exports = router;
