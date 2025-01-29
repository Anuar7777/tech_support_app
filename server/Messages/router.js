const express = require("express");
const router = express.Router();
const { isAuth } = require("../Users/middlewares");
const { sendMessage } = require("./controller");

router.post("/send", isAuth, sendMessage);

module.exports = router;
