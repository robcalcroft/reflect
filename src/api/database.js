const { Pool } = require('pg');

module.exports = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  database: 'reflect',
});
