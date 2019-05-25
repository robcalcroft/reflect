const pool = require('./pool');

const formatRow = row => {
  if (!row) return row;
  const { created_at, user_id, ...rest } = row;
  return {
    ...rest,
    createdAt: created_at,
    userId: user_id,
  };
};

module.exports.addBoard = async ({ name, userId }) => {
  const result = await pool.query(
    'insert into boards (name, user_id) values ($1, $2) returning *',
    [name, userId]
  );
  return formatRow(result.rows && result.rows[0]);
};

module.exports.deleteBoard = async id => {
  const result = pool.query('delete from boards where id = $1', [id]);
  return formatRow(result.rows && result.rows[0]);
};

module.exports.getBoard = async id => {
  const result = await pool.query('select * from boards where id = $1', [id]);
  return formatRow(result.rows && result.rows[0]);
};

module.exports.getBoardsByUserId = async userId => {
  const result = await pool.query('select * from boards where user_id = $1', [
    userId,
  ]);
  return (result.rows || []).map(formatRow);
};
