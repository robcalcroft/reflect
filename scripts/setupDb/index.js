const createDb = require('./createDb');
const createTables = require('./createTables');

(async function setupDb() {
  try {
    await createDb();
    await createTables();
  } catch (e) {
    console.error(e);
  }
})();
