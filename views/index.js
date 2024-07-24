function showAdditionalFields(selectedDbType, index) {
    const additionalFieldsContainer = document.getElementById(
      `additionalFields${index}`
    );
    const mongodbFields = `
<label for="mongoURI${index}">MongoDB URI:</label>
<input type="text" id="mongoURI${index}" name="mongoURI${index}" required><br><br>
<label for="mongoDBName${index}">MongoDB Database Name:</label>
<input type="text" id="mongoDBName${index}" name="mongoDBName${index}" required><br><br>
`;
    const sqliteFields = `
<label for="sqlitePath${index}">SQLite Path:</label>
<input type="text" id="sqlitePath${index}" name="sqlitePath${index}" required><br><br>
`;
    const otherFields = `
<label for="username${index}">Username:</label>
<input type="text" id="username${index}" name="username${index}" required><br><br>
<label for="password${index}">Password:</label>
<input type="password" id="password${index}" name="password${index}" required><br><br>
<label for="host${index}">Host:</label>
<input type="text" id="host${index}" name="host${index}" value="localhost"><br><br>
<label for="port${index}">Port:</label>
<input type="text" id="port${index}" name="port${index}" value="3306"><br><br>
`;
    additionalFieldsContainer.innerHTML =
      selectedDbType === "mongodb"
        ? mongodbFields
        : selectedDbType === "sqlite"
        ? sqliteFields
        : otherFields;
    additionalFieldsContainer.classList.remove("hidden");
    if (
      selectedDbType === "mysql" ||
      selectedDbType === "postgres" ||
      selectedDbType === "oracle"
    ) {
      showDatabaseNameField(index);
    } else {
      hideDatabaseNameField(index);
    }
  }

  function showDatabaseNameField(index) {
    const dbNameContainer = document.getElementById(
      `dbNameContainer${index}`
    );
    dbNameContainer.classList.remove("hidden");
  }

  function hideDatabaseNameField(index) {
    const dbNameContainer = document.getElementById(
      `dbNameContainer${index}`
    );
    dbNameContainer.classList.add("hidden");
  }

  function showAdditionalFieldsForDb1(selectedDbType) {
    showAdditionalFields(selectedDbType, 1);
  }

  function showAdditionalFieldsForDb2(selectedDbType) {
    showAdditionalFields(selectedDbType, 2);
  }

  document
    .getElementById("dbType1")
    .addEventListener("change", function () {
      const selectedDbType = this.value;
      showAdditionalFieldsForDb1(selectedDbType);
    });

  document
    .getElementById("dbType2")
    .addEventListener("change", function () {
      const selectedDbType = this.value;
      showAdditionalFieldsForDb2(selectedDbType);
    });

  document.querySelectorAll(".additional-fields").forEach(function (field) {
    field.classList.add("hidden");
  });
