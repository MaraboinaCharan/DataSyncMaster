// document.addEventListener("DOMContentLoaded", function() {
//     const table1DataDiv = document.getElementById("table1Data");
//     const table2DataDiv = document.getElementById("table2Data");
  
//     // Fetch and display data for table 1
//     fetchTableData("db1", table1DataDiv);
  
//     // Fetch and display data for table 2
//     fetchTableData("db2", table2DataDiv);
//   });
  
//   function fetchTableData(dbType, container) {
//     // Fetch table data based on dbType
//     fetch("/tabledata", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         dbType: dbType,
//       }),
//     })
//     .then(response => response.json())
//     .then(data => {
//       // Display table data
//       displayTableData(data, container);
//     })
//     .catch(error => console.error("Error fetching table data:", error));
//   }
  
//   function displayTableData(data, container) {
//     // Display table data in the specified container
//     // Here, you can implement the logic to display table data in HTML format
//     // You can also highlight the differences between tables here
//     // For simplicity, let's assume data is an object containing table data for display
  
//     // Example logic to display data in a table format
//     let tableHtml = "<table><thead><tr><th>Column Names</th><th>Data</th></tr></thead><tbody>";
  
//     // Iterate through data and generate table rows
//     Object.keys(data).forEach(column => {
//       tableHtml += `<tr><td>${column}</td><td>${data[column]}</td></tr>`;
//     });
  
//     tableHtml += "</tbody></table>";
  
//     // Set the generated HTML to the container
//     container.innerHTML = tableHtml;
//   }
  


// Add this function to fetch data and highlight differences

  document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', fetchDataAndCompare);
  });
  
  function fetchDataAndCompare() {
    const db1Query = document.getElementById('db1table').value;
    const db2Query = document.getElementById('db2table').value;
  
    fetch('/compare-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ db1Query, db2Query }),
    })
    .then(response => response.json())
    .then(data => displayDataWithDifferences(data))
    .catch(error => console.error('Error fetching data:', error));
  }
  
  function displayDataWithDifferences(data) {
    const tableData = document.getElementById('tableData');
    tableData.innerHTML = '';
  
    // Loop through data and display in table
    data.forEach(row => {
      const rowElement = document.createElement('tr');
      for (const value of Object.values(row)) {
        const cell = document.createElement('td');
        cell.textContent = value;
        rowElement.appendChild(cell);
      }
      tableData.appendChild(rowElement);
    });
  }
  
  
  