const express = require("express");
const cors = require("cors");
const app = express();
const port = 9080;

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => res.redirect("index.html"));
// app.get("/", (req, res) => res.send('you are great'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
