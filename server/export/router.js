const express = require("express");
const router = express.Router();
const { isAuth, isValidate } = require("../Users/middlewares");
const {
  exportAnswers,
  exportQuestions,
  exportUsers,
  exportQueries,
} = require("./controllers");

router.get("/answers", isAuth, isValidate, exportAnswers);
router.get("/questions", isAuth, isValidate, exportQuestions);
router.get("/users", isAuth, isValidate, exportUsers);
router.get("/queries", isAuth, isValidate, exportQueries);

module.exports = router;
