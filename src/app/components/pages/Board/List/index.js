import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Droppable } from 'react-beautiful-dnd';
import Card, { NewCard } from '../Card';
import { DELETE_LIST, GET_BOARD } from '../../../../queries';
import './style.css';

function List({ name, createdAt, cards, id, boardId, client }) {
  const [deletingList, setDeletingList] = React.useState(false);

  function sortCards({ position: positionOne }, { position: positionTwo }) {
    if (positionOne > positionTwo) return 1;
    if (positionOne < positionTwo) return -1;
    return 0;
  }

  function handleDeleteList() {
    setDeletingList(true);
    client
      .mutate({
        mutation: DELETE_LIST,
        variables: {
          id,
        },
        optimisticResponse: {
          deleteList: true,
        },
        update(proxy) {
          const variables = {
            id: boardId,
          };
          try {
            const data = proxy.readQuery({
              query: GET_BOARD,
              variables,
            });
            proxy.writeQuery({
              query: GET_BOARD,
              variables,
              data: {
                board: {
                  ...data.board,
                  lists: data.board.lists.filter(list => list.id !== id),
                },
              },
            });
          } catch (error) {
            window.location.reload();
          }
        },
      })
      .catch(error => alert(error.message));
  }

  return (
    <Droppable droppableId={id}>
      {provided => (
        <div
          className="list"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div>{name}</div>
          <div>
            Created {distanceInWordsToNow(new Date(Number(createdAt)))} ago
          </div>
          <button
            type="button"
            onClick={handleDeleteList}
            disabled={deletingList}
          >
            Delete
          </button>
          <div className="list__cards-container">
            {cards
              .sort(sortCards)
              .map(({ id: cardId, body, createdAt: cardCreatedAt }, index) => (
                <Card
                  boardId={boardId}
                  body={body}
                  createdAt={cardCreatedAt}
                  id={cardId}
                  index={index}
                  key={`card${cardId}`}
                  listId={id}
                />
              ))}
            {provided.placeholder}
            <NewCard listId={id} newPosition={cards.length - 1} />
          </div>
        </div>
      )}
    </Droppable>
  );
}

List.propTypes = {
  id: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  cards: PropTypes.array.isRequired,
  client: PropTypes.shape({
    mutate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withApollo(React.memo(List));

export { default as NewList } from './NewList';
