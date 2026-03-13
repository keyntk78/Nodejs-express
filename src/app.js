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

// init db
require("./dbs/init.mongodb");

// init routes
app.use("/", require("./routes"));

// handle error

module.exports = app;
