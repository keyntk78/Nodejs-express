"use strict";

const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const DOCUMENT_NAME = "keyToken";
const COLLECTION_NAME = "key_tokens";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema, COLLECTION_NAME);
