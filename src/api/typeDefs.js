const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    emailAddress: String!
    password: String!
  }

  type Board {
    id: ID!
    name: String!
    owner: User!
    createdAt: String!
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
    boards: [Board!]
    lists(boardId: ID!): [List!]
  }

  type Mutation {
    newBoard(name: String): Board!
    deleteBoard(id: ID): Boolean!
    newList(name: String, boardId: ID): List!
    deleteList(id: ID): Boolean!
    newCard(name: String, listId: ID, description: String): Card!
    deleteCard(id: ID): Boolean!
    updateCardPositions(cards: [CardPositionInput!]): [Card!]!
  }
`;
