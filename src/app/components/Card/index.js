import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Draggable } from 'react-beautiful-dnd';
import { DELETE_CARD } from '../../queries';
import './style.css';
import modifyCards from '../../modifyCards';

function Card({ id, name, description, createdAt, index, client, listId }) {
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeleteClick() {
    setIsDeleting(true);
    client
      .mutate({
        mutation: DELETE_CARD,
        variables: {
          id,
        },
        optimisticResponse: {
          deleteCard: true,
        },
        update(proxy) {
          modifyCards({
            proxy,
            listId,
            modify(cards) {
              return cards.filter(card => card.id !== id);
            },
          });
        },
      })
      .catch(error => alert(error.message));
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
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
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

export { default as NewCard } from './NewCard';
