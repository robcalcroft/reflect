const pool = require('./pool');

module.exports.addCard = async ({
  description,
  listId,
  name,
  position,
  userId,
}) => {
  const result = await pool.query(
    'insert into cards (list_id, name, description, position, user_id) values ($1, $2, $3, $4, $5) returning id, name, list_id as "listId", user_id as "userId", description, created_at as "createdAt", position',
    [listId, name, description, position, userId]
  );
  return result.rows && result.rows[0];
};

module.exports.deleteCard = async id => {
  const result = await pool.query('delete from cards where id = $1', [id]);
  return Boolean(result.rowCount);
};

module.exports.getCardsByListId = async listId => {
  const result = await pool.query(
    'select id, name, list_id as "listId", user_id as "userId", description, created_at as "createdAt", position from cards where list_id = $1',
    [listId]
  );
  return result.rows || [];
};

module.exports.updateCardPositions = async cards => {
  const updates = [];
  for (let index = 0; index < cards.length; index += 1) {
    const currentCard = cards[index];
    updates.push(
      pool.query(
        'update cards set position = $1 where id = $2 returning id, name, list_id as "listId", user_id as "userId", description, created_at as "createdAt", position',
        [currentCard.position, currentCard.id]
      )
    );
  }
  const results = await Promise.all(updates);
  return results.map(result => result.rows && result.rows[0]);
};
