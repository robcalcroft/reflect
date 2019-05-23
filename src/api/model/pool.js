const { Pool } = require('pg');

module.exports = new Pool({ database: 'reflect' });
