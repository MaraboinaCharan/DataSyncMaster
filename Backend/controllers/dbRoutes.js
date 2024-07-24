const express = require("express");
const router = express.Router();
const {
  connectToDB,
  fetchTableDetails,
} = require("../services/dbController");

router.post("/connect", async (req, res) => {
  try {
    await connectToDB(req, res);
  } catch (error) {
    console.log(error.message);

    if (error.message.includes("Invalid database credentials for Source")) {
      res.status(500).send("Invalid database credentials for Source");
    } else if (
      error.message.includes("Invalid database credentials for Target")
    ) {
      res.status(500).send("Invalid database credentials for Target");
    }
  }
});

router.post("/table-details", async (req, res) => {
  try {
    await fetchTableDetails(req, res);
  } catch (error) {
    res.status(500).send("Error fetching schema ");
  }
});

module.exports = router;
