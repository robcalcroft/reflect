const pool = require('./pool');

module.exports.addBoard = async ({ name, userId }) => {
  const result = await pool.query(
    'insert into boards (name, user_id) values ($1, $2) returning *',
    [name, userId]
  );
  return result.rows && result.rows[0];
};

module.exports.deleteBoard = async id => {
  const result = pool.query('delete from boards where id = $1', [id]);
  return result.rows && result.rows[0];
};

module.exports.getBoardsByUserId = async userId => {
  const result = await pool.query('select * from boards where user_id = $1', [
    userId,
  ]);
  return result.rows || [];
};
