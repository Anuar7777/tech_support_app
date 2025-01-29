const express = require("express");
const router = express.Router();
const { isAuth, isValidate } = require("../Users/middlewares");
const { sendQuery, saveQuery } = require("./controller");

router.post("/send", isAuth, isValidate, sendQuery);
router.post("/save/:id", isAuth, isValidate, saveQuery);

module.exports = router;
