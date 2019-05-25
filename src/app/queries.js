import gql from 'graphql-tag';

export const UPDATE_CARD_POSITIONS = gql`
  mutation($cards: [CardPositionInput!]) {
    updateCardPositions(cards: $cards) {
      id
      name
      description
      created_at
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
  mutation newCard(
    $name: String
    $listId: ID
    $description: String
    $position: Int
  ) {
    newCard(
      name: $name
      listId: $listId
      description: $description
      position: $position
    ) {
      id
      name
      description
      created_at
      position
    }
  }
`;
