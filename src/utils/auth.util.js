"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "HS256",
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "HS256",
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const verifyToken = async (token, secretKey) => {
  try {
    return JWT.verify(token, secretKey);
  } catch (error) {
    throw error;
  }
};

const decodeToken = (token) => {
  return JWT.decode(token);
};

module.exports = {
  createTokenPair,
  verifyToken,
  decodeToken,
};
