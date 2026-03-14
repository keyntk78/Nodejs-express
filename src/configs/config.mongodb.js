const dev = {
  uri: process.env.MONGODB_DEV_URI || "mongodb://localhost:27017/js-tip",
};

const prod = {
  uri: process.env.MONGODB_PROD_URI || "mongodb://localhost:27017/js-tip",
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";

module.exports = {
  uri: config[env].uri,
  env,
};
