"use strict";

const _ = require("lodash");

const omitSensitiveFields = (doc, keysToOmit = ["password"]) => {
  const plainObj = doc.toObject ? doc.toObject() : doc;
  return _.omit(plainObj, keysToOmit);
};

const getInfoData = (object, fields = []) => {
  return _.pick(object, fields);
};

module.exports = { omitSensitiveFields, getInfoData };
