const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email_address: String!
    password: String!
    created_at: String!
  }

  type Board {
    id: ID!
    name: String!
    userId: User!
    createdAt: String!
  }

  type List {
    id: ID!
    name: String!
    created_at: String!
    cards: [Card!]
  }

  type Card {
    id: ID!
    name: String!
    description: String
    created_at: String!
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
    newCard(name: String, listId: ID, description: String, position: Int): Card!
    deleteCard(id: ID): Boolean!
    updateCardPositions(cards: [CardPositionInput!]): [Card!]!
  }
`;
