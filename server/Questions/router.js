const express = require("express");
const router = express.Router();
const { isAuth, isValidate } = require("./../auth/middlewares");
const {
  createQuestion,
  editQuestion,
  deleteQuestion,
} = require("./controller");

router.post("/new", isAuth, isValidate, createQuestion);
router.post("/edit/:id", isAuth, isValidate, editQuestion);
router.delete("/:id", isAuth, isValidate, deleteQuestion);

module.exports = router;
