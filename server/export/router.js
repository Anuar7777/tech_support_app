const express = require("express");
const router = express.Router();
const { isAuth, isValidate } = require("./../auth/middlewares");
const { exportAnswers, exportQuestions, exportUsers } = require("./controllers");

router.get("/answers", isAuth, isValidate, exportAnswers);
router.get("/questions", isAuth, isValidate, exportQuestions);
router.get("/users", isAuth, isValidate, exportUsers);

module.exports = router;
