require("dotenv").config();

const { default: helmet } = require("helmet");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./dbs/init.mongodb");

// init routes
app.use("/", require("./routes"));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  return res.status(statusCode).json({
    status: "error",
    code,
    message: err.message,
  });
});

module.exports = app;
