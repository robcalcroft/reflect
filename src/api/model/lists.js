const pool = require('./pool');

module.exports.addList = async ({ boardId, name, userId }) => {
  const result = await pool.query(
    'insert into lists (name, board_id, user_id) values ($1, $2, $3) returning id, name, board_id as "boardId", user_id as "userId", created_at as "createdAt"',
    [name, boardId, userId]
  );
  return result.rows && result.rows[0];
};

module.exports.deleteList = async id => {
  const result = pool.query('delete from lists where id = $1', [id]);
  return result.rows && result.rows[0];
};

module.exports.getListsByBoardId = async boardId => {
  const result = await pool.query(
    'select id, name, board_id as "boardId", user_id as "userId", created_at as "createdAt" from lists where board_id = $1',
    [boardId]
  );
  return result.rows || [];
};
