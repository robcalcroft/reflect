require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { Client } = require('pg');

const tableNames = ['users', 'boards', 'lists', 'cards'];

module.exports = async function createTables() {
  const client = new Client({ database: 'reflect' });
  client.on('error', console.error);
  try {
    await client.connect();
    for (const tableName of tableNames) {
      const sqlPath = path.join(__dirname, 'tables', `${tableName}.sql`);
      const sql = await fs.readFile(sqlPath, 'utf8');
      await client.query(sql);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
};
