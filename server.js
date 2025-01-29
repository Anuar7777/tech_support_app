const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", require("./server/Users/router"));
app.use("/api/answer", require("./server/Answers/router"));
app.use("/api/question", require("./server/Questions/router"));
app.use("/api/export", require("./server/export/router"));
app.use("/api/chat", require("./server/Messages/router"));
app.use("/api/query", require("./server/Queries/router"));
app.use(require("./server/pages/router"));

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
