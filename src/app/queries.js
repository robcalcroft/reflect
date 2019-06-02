import gql from 'graphql-tag';

export const UPDATE_CARD_POSITIONS = gql`
  mutation($cards: [CardPositionInput!]) {
    updateCardPositions(cards: $cards) {
      id
      body
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

export const NEW_CARD = gql`
  mutation newCard($body: String!, $listId: ID, $position: Int) {
    newCard(body: $body, listId: $listId, position: $position) {
      id
      body
      createdAt
      position
    }
  }
`;
