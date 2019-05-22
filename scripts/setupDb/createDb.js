require('dotenv').config();
const { Client } = require('pg');

module.exports = async function createDb() {
  const client = new Client({ database: 'postgres' });
  client.on('error', console.error);
  try {
    await client.connect();
    await client.query('create database reflect');
  } catch (e) {
    if (e.message !== `database "reflect" already exists`) console.error(e);
  } finally {
    await client.end();
  }
};
