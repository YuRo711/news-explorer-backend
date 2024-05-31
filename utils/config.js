const crypto = require('crypto');

const { NODE_ENV, JWT_SECRET, DB_HOST } = process.env;

module.exports.JWT_SECRET = 
  NODE_ENV === 'production' ? 
    JWT_SECRET : crypto.randomBytes(16).toString('hex');

module.exports.DB_HOST = 
  NODE_ENV === 'production' ? 
    DB_HOST : 'mongodb://127.0.0.1:27017/news_db';
  