require('dotenv').config();
const { Client } = require('pg');
const { addBoard } = require('../src/api/model/boards');
const { addCard } = require('../src/api/model/cards');
const { addList } = require('../src/api/model/lists');
const { addUser } = require('../src/api/model/users');

(async function addData() {
  const client = new Client({ database: 'reflect' });
  client.on('error', console.error);
  try {
    await client.connect();
    await addUser({
      name: 'Test user',
      emailAddress: 'test@user.com',
      password: 'pass',
    });
    await addBoard({ name: 'Test board', userId: '1' });
    await addList({ boardId: '1', name: 'Test list', userId: '1' });
    await addCard({
      description: 'Please add some more features to Reflect!',
      listId: '1',
      name: 'Not enough features',
      position: '1',
      userId: '1',
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
})();
