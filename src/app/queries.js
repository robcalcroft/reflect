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

export const NEW_LIST = gql`
  mutation newList($name: String, $boardId: ID) {
    newList(name: $name, boardId: $boardId) {
      id
      name
      createdAt
    }
  }
`;

export const GET_BOARD = gql`
  query board($id: ID!) {
    board(id: $id) {
      createdAt
      name
      lists {
        id
        name
        createdAt
        cards {
          id
          body
          createdAt
          position
        }
      }
    }
  }
`;
