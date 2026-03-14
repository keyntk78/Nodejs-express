"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../utils/auth.util");
const { getInfoData } = require("../utils/object.util");
const KeyTokenService = require("./keyToken.service");
const { RoleShop } = require("../constants/role.constant");

class AuthService {
  static signUp = async ({ name, email, password }) => {
    try {
      console.log("[S]::signUp", { name, email, password });
      // step 1: check email exist
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already exists",
        };
      }

      // step 2: hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // step 3: create new shop
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      // step 4: create key token
      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "Create key token failed",
            status: "error",
          };
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          privateKey,
        );
        const shopData = getInfoData(newShop, ["_id", "name", "email"]);

        return {
          code: "0000001",
          metadata: {
            shop: shopData,
            tokens,
          },
          message: "Sign up successfully",
        };
      }

      return {
        code: "xxxx",
        message: "Sign up failed",
        status: "error",
      };
    } catch (error) {
      return {
        code: "xxxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AuthService;
