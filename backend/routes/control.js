const express = require("express");
const deviceAuth = require("../middleware/deviceAuth");
const { getControl } = require("../controllers/controlController");

const router = express.Router();

router.get("/:deviceId", deviceAuth, getControl);

module.exports = router;
