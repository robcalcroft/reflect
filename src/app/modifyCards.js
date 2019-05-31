import gql from 'graphql-tag';

export default function modifyCards({ proxy, listId, modify }) {
  let data = {};
  const id = `List:${listId}`;
  const fragment = gql`
    fragment getList on List {
      cards {
        id
        body
        createdAt
        position
      }
    }
  `;

  try {
    data = proxy.readFragment({
      id,
      fragment,
    });
  } catch (error) {
    window.location.reload();
    return;
  }

  let { cards } = data;
  cards = modify(cards);

  proxy.writeFragment({
    id,
    fragment,
    data: {
      __typename: 'List',
      cards,
    },
  });
}
