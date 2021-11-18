const express = require("express");
const mongoose = require("mongoose");
const Document = require("./models/Document");

mongoose.connect(
  "mongodb+srv://wastebinuser:wastebinsecret@wastebin.sm78d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log("connected to mongodb");
  }
);
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const code = `Welcome to WasteBin!

Use the commands in the top right corner
to create a new file to share with others`;
  res.render("code-display", { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (error) {
    res.render("new", value);
  }
});

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);

    res.render("new", { code: document.value });
  } catch (error) {
    res.redirect(`${id}`);
  }
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);

    res.render("code-display", { code: document.value, id });
  } catch (error) {
    res.redirect("/");
  }
});

app.listen("3000", () => {
  console.log("server is running on port 3000");
});
