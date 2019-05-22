require('dotenv').config();
const { ApolloServer, UserInputError, ApolloError } = require('apollo-server');
const { GraphQLError } = require('graphql');
const database = require('./database');
const typeDefs = require('./typeDefs');

const getRows = result => result.rows || [];
const getFirst = rows => (rows.length > 0 ? rows[0] : []);

const resolvers = {
  Query: {
    boards: (_, __, { user }) =>
      database
        .query('select * from boards where user_id = $1', [user.id])
        .then(getRows),
    lists: (_, { boardId }) =>
      database
        .query('select * from lists where board_id = $1', [boardId])
        .then(getRows),
  },
  Mutation: {
    newBoard: (_, { name }, { user }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the board');
      }

      return database
        .query(
          'insert into boards (name, user_id) values ($1, $2) returning *',
          [name, user.id]
        )
        .then(getRows)
        .then(getFirst);
    },
    deleteBoard: async (_, { id }) => {
      const response = await database.query(
        'delete from boards where id = $1',
        [id]
      );

      if (response.rowCount === 0) {
        throw new UserInputError(
          "That board doesn't exist so cannot be deleted"
        );
      }

      return true;
    },
    newList: (_, { name, boardId }, { user }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the board');
      }

      if (!boardId) {
        throw new UserInputError('Lists require a board ID');
      }

      return database
        .query(
          'insert into lists (name, board_id, user_id) values ($1, $2, $3) returning *',
          [name, boardId, user.id]
        )
        .then(getRows)
        .then(getFirst);
    },
    deleteList: async (_, { id }) => {
      const response = await database.query('delete from lists where id = $1', [
        id,
      ]);

      if (response.rowCount === 0) {
        throw new UserInputError(
          "That list doesn't exist so cannot be deleted"
        );
      }

      return true;
    },
    newCard: (_, { name, listId, description, position }, { user }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the card');
      }

      if (!listId) {
        throw new UserInputError('Cards require a list ID');
      }

      return database
        .query(
          'insert into cards (list_id, name, description, position, user_id) values ($1, $2, $3, $4, $5) returning *',
          [listId, name, description, position, user.id]
        )
        .then(getRows)
        .then(getFirst);
    },
    deleteCard: async (_, { id }) => {
      const response = await database.query('delete from cards where id = $1', [
        id,
      ]);

      if (response.rowCount === 0) {
        throw new UserInputError(
          "That card doesn't exist so cannot be deleted"
        );
      }

      return true;
    },
    updateCardPositions: async (_, { cards }) => {
      if (cards.length === 0)
        throw new UserInputError('No cards given to update');
      const updates = [];
      for (let index = 0; index < cards.length; index += 1) {
        const currentCard = cards[index];
        updates.push(
          database.query(
            'update cards set position = $1 where id = $2 returning *',
            [currentCard.position, currentCard.id]
          )
        );
      }
      return Promise.all(updates).then(results =>
        results.map(getRows).map(getFirst)
      );
    },
  },
  List: {
    cards: ({ id: listId }) =>
      database
        .query('select * from cards where list_id = $1', [listId])
        .then(getRows),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    user: await database
      .query('select * from users where id = 1')
      .then(getRows)
      .then(getFirst),
  }),
  formatError: error => {
    if (error.originalError instanceof ApolloError) return error;
    console.log(error);
    // Add error logger here with uuids
    return new GraphQLError('Something went wrong, please try again');
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
