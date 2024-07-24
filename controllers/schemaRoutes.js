const express = require("express");
const router = express.Router();
const { fetchSchemaData } = require("../services/schemaController");

router.get("/schemavalue", fetchSchemaData);

module.exports = router;
