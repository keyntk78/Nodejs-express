"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createTokenPair } = require("../utils/auth.util");
const { getInfoData } = require("../utils/object.util");
const KeyTokenService = require("./keyToken.service");
const { RoleShop } = require("../constants/role.constant");
const {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../core/error.response");

class AuthService {
  static signUp = async ({ name, email, password }) => {
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new ConflictRequestError("Shop already exists");
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

      const tokens = await createTokenPair(
        { userId: newShop._id, email, name, roles: newShop.roles },
        privateKey,
      );

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Create key token failed");
      }

      const shopData = getInfoData(newShop, [
        "_id",
        "name",
        "email",
        "roles",
        "status",
        "verify",
      ]);

      return {
        shop: shopData,
        tokens,
      };
    }

    throw new BadRequestError("Sign up failed");
  };

  /**
   * @param {Object} param0
   * @param {string} param0.email
   * @param {string} param0.password
   * step 1: check email exist
   * step 2: compare password
   * step 3: create AT and RT and save
   * step 4: generate token pair
   * step 5: return data login
   */
  static signIn = async ({ email, password }) => {
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();

    if (!holderShop) {
      throw new NotFoundError("Shop not found");
    }

    // step 2: compare password
    const isMatch = await bcrypt.compare(password, holderShop.password);
    if (!isMatch) {
      throw new UnauthorizedError("Authentication error");
    }

    // step 3: create key token (AT and RT) and save
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      {
        userId: holderShop._id,
        email,
        name: holderShop.name,
        roles: holderShop.roles,
      },
      privateKey,
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId: holderShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore) {
      throw new BadRequestError("Create key token failed");
    }

    // step 5: return data login
    const shopData = getInfoData(holderShop, [
      "_id",
      "name",
      "email",
      "roles",
      "status",
      "verify",
    ]);
    return {
      shop: shopData,
      tokens,
    };
  };
}

module.exports = AuthService;
