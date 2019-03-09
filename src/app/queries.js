import gql from 'graphql-tag';

export const GET_LISTS = gql`
  query lists($boardId: ID!) {
    lists(boardId: $boardId) {
      id
      name
      createdAt
      cards {
        id
        name
        description
        createdAt
        position
      }
    }
  }
`;

export const UPDATE_CARD_POSITIONS = gql`
  mutation($cards: [CardPositionInput!]) {
    updateCardPositions(cards: $cards) {
      id
      name
      description
      createdAt
      position
    }
  }
`;

export const DELETE_CARD = gql`
  mutation deleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;
