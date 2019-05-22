require('dotenv').config();
const { Client } = require('pg');

(async function addData() {
  const client = new Client({ database: 'reflect' });
  client.on('error', console.error);
  try {
    await client.connect();
    await client.query(
      'insert into users (name, email_address, password) values ($1, $2, $3) returning *',
      ['Test user', 'test@user.com', 'pass']
    );
    await client.query(
      'insert into boards (name, user_id) values ($1, $2) returning *',
      ['Test board', '1']
    );
    await client.query(
      'insert into lists (name, board_id, user_id) values ($1, $2, $3) returning *',
      ['Test list', '1', '1']
    );
    await client.query(
      'insert into cards (list_id, name, description, position, user_id) values ($1, $2, $3, $4, $5) returning *',
      [
        '1',
        'Not enough features',
        'Please add some more features to Reflect!',
        1,
        '1',
      ]
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
})();
