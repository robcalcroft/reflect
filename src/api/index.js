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
        .query('select * from "Boards" where owner = $1', [user.id])
        .then(getRows),
    lists: (_, { boardId }) =>
      database
        .query('select * from "Lists" where board = $1', [boardId])
        .then(getRows),
  },
  Mutation: {
    newBoard: (_, { name }, { user }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the board');
      }

      return database
        .query(
          'insert into "Boards" (name, owner) values ($1, $2) returning *',
          [name, user.id]
        )
        .then(getRows)
        .then(getFirst);
    },
    deleteBoard: async (_, { id }) => {
      const response = await database.query(
        'delete from "Boards" where id = $1',
        [id]
      );

      if (response.rowCount === 0) {
        throw new UserInputError(
          "That board doesn't exist so cannot be deleted"
        );
      }

      return true;
    },
    newList: (_, { name, boardId }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the board');
      }

      if (!boardId) {
        throw new UserInputError('Lists require a board ID');
      }

      return database
        .query(
          'insert into "Lists" (name, board) values ($1, $2) returning *',
          [name, boardId]
        )
        .then(getRows)
        .then(getFirst);
    },
    deleteList: async (_, { id }) => {
      const response = await database.query(
        'delete from "Lists" where id = $1',
        [id]
      );

      if (response.rowCount === 0) {
        throw new UserInputError(
          "That list doesn't exist so cannot be deleted"
        );
      }

      return true;
    },
    newCard: (_, { name, listId, description, position }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the card');
      }

      if (!listId) {
        throw new UserInputError('Cards require a list ID');
      }

      return database
        .query(
          'insert into "Cards" (list, name, description, position) values ($1, $2, $3, $4) returning *',
          [listId, name, description, position]
        )
        .then(getRows)
        .then(getFirst);
    },
    deleteCard: async (_, { id }) => {
      const response = await database.query(
        'delete from "Cards" where id = $1',
        [id]
      );

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
            'update "Cards" set position = $1 where id = $2 returning *',
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
        .query('select * from "Cards" where list = $1', [listId])
        .then(getRows),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    user: await database
      .query('select * from "WebUsers" where id = 1')
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
