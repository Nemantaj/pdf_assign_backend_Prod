const path = require("path");
const parser = require("body-parser");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./route/user");
const formRoutes = require("./route/form");

const PORT = 3001;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const MONGODB_URI =
  "mongodb+srv://root:bvNJjq9M36AceBPg@cluster0.fxlmihd.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.use(cors(corsOptions));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(formRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  res.status(status).json({
    title: error.title,
    msg: error.message,
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    app.listen(PORT);
    console.log("Listening on port " + PORT);
  })
  .catch((err) => {
    console.log(err);
  });
