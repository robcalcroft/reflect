const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    emailAddress: String!
    password: String!
    createdAt: String!
  }

  type Board {
    id: ID!
    createdAt: String!
    lists: [List!]
    name: String!
    userId: User!
  }

  type List {
    id: ID!
    name: String!
    createdAt: String!
    cards: [Card!]
  }

  type Card {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    position: Int!
  }

  input CardPositionInput {
    id: ID!
    position: Int!
  }

  type Query {
    board(id: ID!): Board
    boards: [Board!]
  }

  type Mutation {
    newBoard(name: String): Board!
    deleteBoard(id: ID): Boolean!
    newList(name: String, boardId: ID): List!
    deleteList(id: ID): Boolean!
    newCard(name: String, listId: ID, description: String, position: Int): Card!
    deleteCard(id: ID): Boolean!
    updateCardPositions(cards: [CardPositionInput!]): [Card!]!
  }
`;
