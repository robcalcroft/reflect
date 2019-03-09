import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Draggable } from 'react-beautiful-dnd';
import { GET_LISTS, DELETE_CARD } from '../../queries';
import './style.css';

function Card({
  id,
  name,
  description,
  createdAt,
  index,
  client,
  boardId,
  listId,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeleteClick() {
    setIsDeleting(true);
    client.mutate({
      mutation: DELETE_CARD,
      variables: {
        id,
      },
      onError() {
        setIsDeleting(false);
      },
      update(proxy) {
        let data = {};

        try {
          data = proxy.readQuery({
            query: GET_LISTS,
            variables: { boardId },
          });
        } catch (error) {
          window.location.reload();
          return;
        }

        const { lists } = data;
        const isThisList = list => list.id === listId;
        const listIndex = lists.findIndex(isThisList);
        const { cards } = lists.find(isThisList);
        const updatedCards = cards.filter(card => card.id !== id);
        lists[listIndex] = {
          ...lists[listIndex],
          cards: updatedCards,
        };

        proxy.writeQuery({
          query: GET_LISTS,
          data: { lists },
        });
      },
    });
  }

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div>
            <div>{name}</div>
            <div>{description}</div>
            <div>
              Created {distanceInWordsToNow(new Date(Number(createdAt)))} ago
            </div>
            <button type="button" onClick={handleDeleteClick}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  client: PropTypes.shape({
    mutate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withApollo(React.memo(Card));
