"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const config = require("../configs/config.mongodb");

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (config.env === "dev") {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(`mongodb://${config.host}:${config.port}/${config.name}`)
      .then(() => {
        console.log("mongo connected");
        countConnect();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
