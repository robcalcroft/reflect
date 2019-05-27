require('dotenv').config();
const { ApolloServer, UserInputError, ApolloError } = require('apollo-server');
const { GraphQLError } = require('graphql');
const typeDefs = require('./typeDefs');
const {
  addBoard,
  deleteBoard,
  getBoard,
  getBoardsByUserId,
} = require('./model/boards');
const {
  addCard,
  deleteCard,
  getCardsByListId,
  updateCardPositions,
} = require('./model/cards');
const { addList, deleteList, getListsByBoardId } = require('./model/lists');
const { getUser } = require('./model/users');
const { NOT_FOUND_CODE } = require('../shared/constants');

const resolvers = {
  Query: {
    board: async (_, { id }) => {
      const board = await getBoard(id);
      if (!board) throw new UserInputError(NOT_FOUND_CODE);
      return board;
    },
    boards: (_, __, { user }) => getBoardsByUserId(user.id),
  },
  Mutation: {
    newBoard: (_, { name }, { user }) => {
      if (!name) {
        throw new UserInputError('You must give a name to the board');
      }

      return addBoard({ name, userId: user.id });
    },
    deleteBoard: async (_, { id }) => {
      const result = await deleteBoard(id);

      if (!result) {
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

      return addList({ boardId, name, userId: user.id });
    },
    deleteList: async (_, { id }) => {
      const result = await deleteList(id);

      if (!result) {
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

      return addCard({
        description,
        listId,
        name,
        position,
        userId: user.id,
      });
    },
    deleteCard: async (_, { id }) => {
      const result = await deleteCard(id);

      if (!result) {
        throw new UserInputError(
          "That card doesn't exist so cannot be deleted"
        );
      }

      return true;
    },
    updateCardPositions: async (_, { cards }) => {
      if (cards.length === 0)
        throw new UserInputError('No cards given to update');

      return updateCardPositions(cards);
    },
  },
  Board: {
    lists: ({ id }) => getListsByBoardId(id),
  },
  List: {
    cards: ({ id: listId }) => getCardsByListId(listId),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({ user: await getUser('1') }),
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
