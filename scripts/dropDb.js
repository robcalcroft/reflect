require('dotenv').config();
const { Client } = require('pg');

(async function dropDb() {
  const client = new Client({ database: 'postgres' });
  client.on('error', console.error);
  try {
    await client.connect();
    await client.query('drop database if exists reflect');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
})();
