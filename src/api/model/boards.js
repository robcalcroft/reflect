const pool = require('./pool');

module.exports.addBoard = async ({ name, userId }) => {
  const result = await pool.query(
    'INSERT INTO boards (name, user_id) VALUES ($1, $2) RETURNING id, name, created_at AS "createdAt", user_id AS "userId"',
    [name, userId]
  );
  return result.rows && result.rows[0];
};

module.exports.deleteBoard = async id => {
  const result = await pool.query('DELETE FROM boards WHERE id = $1', [id]);
  return Boolean(result.rowCount);
};

module.exports.getBoard = async id => {
  const result = await pool.query(
    'SELECT id, name, created_at AS "createdAt", user_id AS "userId" FROM boards WHERE id = $1',
    [id]
  );
  return result.rows && result.rows[0];
};

module.exports.getBoardsByUserId = async userId => {
  const result = await pool.query(
    'SELECT id, name, created_at AS "createdAt", user_id AS "userId" FROM boards WHERE user_id = $1',
    [userId]
  );
  return result.rows || [];
};
