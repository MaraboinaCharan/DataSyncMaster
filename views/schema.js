// function fetchTableDetails(dbType, tableName) {

//     fetch("/table-details", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         dbType,
//         tableName,
//       }),
//     })

//     .then((response) => response.json())
//     .then((data) => {
//       let currentTableDetailsDiv = document.getElementById(dbType === "db1" ? "db1TableDetails" : "db2TableDetails");
//       let otherTableDetailsDiv = document.getElementById(dbType === "db1" ? "db2TableDetails" : "db1TableDetails");
//       currentTableDetailsDiv.innerHTML = "";
//       let currentTableDetails = data.columns;
//       let otherTableDetails = JSON.parse(otherTableDetailsDiv.dataset.columns || "{}");
//       let sortedCurrentTableColumns = Object.keys(currentTableDetails).sort();
//       let sortedOtherTableColumns = Object.keys(otherTableDetails).sort();

//       let tableHtml = "<table><thead><tr><th>Column Names</th><th>Data Types</th></tr></thead><tbody>";
 
//       sortedCurrentTableColumns.forEach((column) => {
//         let currentColumnType = currentTableDetails[column];
//         let otherColumnType = otherTableDetails[column];
//         let rowClass = "";
//         if (currentColumnType !== otherColumnType) {
//           rowClass = "highlight-red";
//         }
//         tableHtml += `<tr class="${rowClass}"><td>${column}</td><td>${currentColumnType}</td></tr>`;
//       });

//       tableHtml += "</tbody></table>";
//       currentTableDetailsDiv.innerHTML = tableHtml;
//       currentTableDetailsDiv.dataset.columns = JSON.stringify(currentTableDetails);

//       compareTableDetails("db1", sortedCurrentTableColumns, otherTableDetails);
//       compareTableDetails("db2", sortedCurrentTableColumns, otherTableDetails);

//     })
//     .catch((error) => console.error("Error fetching table details:", error));
//   }

//   function fetchAndPopulateSchemaData() {
//     fetch("/schemavalue")
//     .then((response) => response.json())
//     .then((data) => {
//       const db1Dropdown = document.getElementById("db1SchemaDropdown");
//       const db2Dropdown = document.getElementById("db2SchemaDropdown");
//       db1Dropdown.innerHTML = "<option value='' selected>Select column name</option>"; 
//       db2Dropdown.innerHTML = "<option value='' selected>Select column name</option>"; 

//       let sortedSchema1Tables = Object.keys(data.schema1).sort();
//       let sortedSchema2Tables = Object.keys(data.schema2).sort();

//       sortedSchema1Tables.forEach((table) => {
//         db1Dropdown.innerHTML += `<option value="${table}">${table}</option>`;
//       });

//       sortedSchema2Tables.forEach((table) => {
//         db2Dropdown.innerHTML += `<option value="${table}">${table}</option>`;
//       });

//       db1Dropdown.addEventListener("change", function () {
//         let selectedTable = this.value;
//         fetchTableDetails("db1", selectedTable);
//         let otherSelectedTable = db2Dropdown.value;
//         if (selectedTable === otherSelectedTable) {
//           fetchTableDetails("db2", selectedTable);
//         }
//       });

//       db2Dropdown.addEventListener("change", function () {
//         let selectedTable = this.value;
//         fetchTableDetails("db2", selectedTable);
//         let otherSelectedTable = db1Dropdown.value;
//         if (selectedTable === otherSelectedTable) {
//           fetchTableDetails("db1", selectedTable);
//         }
//       });

//       db1Dropdown.dispatchEvent(new Event('change'));
//       db2Dropdown.dispatchEvent(new Event('change'));
//     })
//     .catch((error) => console.error("Error fetching schema data:", error));
//   }


  // window.onload = fetchAndPopulateSchemaData;

  document.getElementById("navigateButton").addEventListener("click", function() {
    // Redirect to tabledata.html
    window.location.href = "/views/tabledata.html";
  });

  

  function fetchTableDetails(dbType, tableName) {
    console.log("jsontab",JSON.stringify({dbType,tableName}));
    fetch("/table-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dbType,
        tableName,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("totdata",data);  
      let currentTableDetailsDiv = document.getElementById(dbType === "db1" ? "db1TableDetails" : "db2TableDetails");
      let otherTableDetailsDiv = document.getElementById(dbType === "db1" ? "db2TableDetails" : "db1TableDetails");
      currentTableDetailsDiv.innerHTML = "";
      let currentTableDetails = data.columns;
      let otherTableDetails = JSON.parse(otherTableDetailsDiv.dataset.columns || "{}");
      let sortedCurrentTableColumns = Object.keys(currentTableDetails).sort();
      let sortedOtherTableColumns = Object.keys(otherTableDetails).sort();

      let tableHtml = "<table><thead><tr><th>Column Names</th><th>Data Types</th></tr></thead><tbody>";
 
      sortedCurrentTableColumns.forEach((column) => {
        let currentColumnType = currentTableDetails[column];
        let otherColumnType = otherTableDetails[column];
        let rowClass = "";
        if (currentColumnType !== otherColumnType) {
          rowClass = "highlight-red";
        }
        tableHtml += `<tr class="${rowClass}"><td>${column}</td><td>${currentColumnType}</td></tr>`;
      });

      tableHtml += "</tbody></table>";
      currentTableDetailsDiv.innerHTML = tableHtml;
      currentTableDetailsDiv.dataset.columns = JSON.stringify(currentTableDetails);

     
      compareTableDetails("db1", sortedCurrentTableColumns, otherTableDetails);
      compareTableDetails("db2", sortedCurrentTableColumns, otherTableDetails);
    })
    .catch((error) => console.error("Error fetching table details:", error));
  }

function compareTableDetails(dbType, currentColumns, otherTableDetails) {
    let currentTableDetailsDiv = document.getElementById(dbType === "db1" ? "db1TableDetails" : "db2TableDetails");
    let sortedCurrentTableColumns = currentColumns;
    let tableHtml = "<table><thead><tr><th>Column Names</th><th>Data Types</th></tr></thead><tbody>";
 
    sortedCurrentTableColumns.forEach((column) => {
        let currentColumnType = currentTableDetails[column];
        let otherColumnType = otherTableDetails[column];
        let rowClass = "";
        if (currentColumnType !== otherColumnType) {
            rowClass = "highlight-red";
        }
        tableHtml += `<tr class="${rowClass}"><td>${column}</td><td>${currentColumnType}</td></tr>`;
    });

    tableHtml += "</tbody></table>";
    currentTableDetailsDiv.innerHTML = tableHtml;
}

function fetchAndPopulateSchemaData() {
    fetch("/schemavalue")
    .then((response) => response.json())
    .then((data) => {
        const db1Dropdown = document.getElementById("db1SchemaDropdown");
        const db2Dropdown = document.getElementById("db2SchemaDropdown");
        db1Dropdown.innerHTML = "<option value='' selected>Select column name</option>"; 
        db2Dropdown.innerHTML = "<option value='' selected>Select column name</option>"; 

        let sortedSchema1Tables = Object.keys(data.schema1).sort();
        let sortedSchema2Tables = Object.keys(data.schema2).sort();

        sortedSchema1Tables.forEach((table) => {
            db1Dropdown.innerHTML += `<option value="${table}">${table}</option>`;
        });

        sortedSchema2Tables.forEach((table) => {
            db2Dropdown.innerHTML += `<option value="${table}">${table}</option>`;
        });

        db1Dropdown.addEventListener("change", function () {
            let selectedTable = this.value;
            fetchTableDetails("db1", selectedTable);
            let otherSelectedTable = db2Dropdown.value;
            if (selectedTable === otherSelectedTable) {
                fetchTableDetails("db2", selectedTable);
            }
            else {
                fetchTableDetails("db2", otherSelectedTable);
            }
        });

        db2Dropdown.addEventListener("change", function () {
            let selectedTable = this.value;
            fetchTableDetails("db2", selectedTable);
            let otherSelectedTable = db1Dropdown.value;
            if (selectedTable === otherSelectedTable) {
                fetchTableDetails("db1", selectedTable);
            }
            else {
                fetchTableDetails("db1", otherSelectedTable);
            }
        });

        db1Dropdown.dispatchEvent(new Event('change'));
        db2Dropdown.dispatchEvent(new Event('change'));
    })
    .catch((error) => console.error("Error fetching schema data:", error));
}

window.onload = fetchAndPopulateSchemaData;



