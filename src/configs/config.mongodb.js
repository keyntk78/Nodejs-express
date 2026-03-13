const dev = {
  host: process.env.MONGODB_DEV_HOST || "localhost",
  port: process.env.MONGODB_DEV_PORT || 27017,
  name: process.env.MONGODB_DEV_NAME || "js-tip",
};

const prod = {
  host: process.env.MONGODB_PROD_HOST || "localhost",
  port: process.env.MONGODB_PROD_PORT || 27017,
  name: process.env.MONGODB_PROD_NAME || "js-tip",
};

const config = { dev, prod };

const env = process.env.NODE_ENV || "dev";

module.exports = {
  ...config[env],
  env,
};
