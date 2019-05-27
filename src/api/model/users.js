const pool = require('./pool');

module.exports.addUser = async ({ emailAddress, name, password }) => {
  const result = await pool.query(
    'insert into users (email_address, name, password) values ($1, $2, $3) returning id, name, email_address as "emailAddress", password, created_at as "createdAt"',
    [emailAddress, name, password]
  );
  return result.rows && result.rows[0];
};

module.exports.getUser = async id => {
  const result = await pool.query(
    'select id, name, email_address as "emailAddress", password, created_at as "createdAt" from users where id = $1',
    [id]
  );
  return result.rows && result.rows[0];
};
