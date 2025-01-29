const express = require("express");
const router = express.Router();
const { createAnswer, editAnswer, deleteAnswer } = require("./controller");
const { isAuth, isValidate } = require("../Users/middlewares");

router.post("/new", isAuth, isValidate, createAnswer);
router.post("/edit/:id", isAuth, isValidate, editAnswer);
router.delete("/:id", isAuth, isValidate, deleteAnswer);

module.exports = router;
