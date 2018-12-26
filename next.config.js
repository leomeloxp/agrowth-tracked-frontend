const withCSS = require('@zeit/next-css');
const withPlugins = require('next-compose-plugins');
const withTypescript = require('@zeit/next-typescript');
require('dotenv').config();

const { NODE_ENV, PROD_BACKEND_URL, DEV_BACKEND_URL } = process.env;

let uri = NODE_ENV === 'production' ? PROD_BACKEND_URL : DEV_BACKEND_URL;
if (!uri) {
  uri = 'http://localhost:4000/graphql';
}

module.exports = withPlugins([withTypescript, withCSS], {
  publicRuntimeConfig: {
    uri
  }
});
