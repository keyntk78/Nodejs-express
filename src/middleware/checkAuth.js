"use strict";

const apiKeyService = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "API Key is required",
      });
    }

    const objKey = await apiKeyService.findById(key);
    if (!objKey) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "Invalid API Key",
      });
    }

    // check permissions
    req.objKey = objKey;

    return next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      code: "FORBIDDEN",
      message: error.message,
    });
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions.includes(permission)) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "Permission denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "Permission denied",
      });
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
