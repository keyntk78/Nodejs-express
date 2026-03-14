"use strict";

const apiKeyService = require("../services/apikey.service");
const KeyTokenService = require("../services/keyToken.service");
const { verifyToken } = require("../utils/auth.util");
const { UnauthorizedError } = require("../core/error.response");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
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

const authentication = async (req, res, next) => {
  try {
    const accessToken = req.headers[HEADER.AUTHORIZATION]?.replace(
      "Bearer ",
      "",
    );
    const clientId = req.headers[HEADER.CLIENT_ID]?.toString();

    if (!accessToken || !clientId) {
      throw new UnauthorizedError("Authorization and x-client-id are required");
    }

    const keyStore = await KeyTokenService.findByUserId(clientId);
    if (!keyStore) {
      throw new UnauthorizedError("Invalid request");
    }

    const decoded = await verifyToken(accessToken, keyStore.privateKey);
    if (decoded.userId !== clientId) {
      throw new UnauthorizedError("Invalid request");
    }

    req.user = decoded;
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  apiKey,
  permission,
  authentication,
  HEADER,
};
