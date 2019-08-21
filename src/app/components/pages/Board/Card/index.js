import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Draggable } from 'react-beautiful-dnd';
import { DELETE_CARD } from '../../../../queries';
import './style.css';
import modifyCards from '../../../../modifyCards';

function Card({ id, body, createdAt, index, listId }) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteCard] = useMutation(DELETE_CARD);

  function handleDeleteClick() {
    setIsDeleting(true);
    deleteCard({
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
    }).catch(error => alert(error.message));
  }

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          className="card"
          ref={provided.innerRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.draggableProps}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...provided.dragHandleProps}
        >
          <div>
            <div>{body}</div>
            <div>
              Created {formatDistanceToNow(new Date(Number(createdAt)))} ago
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
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default React.memo(Card);

export { default as NewCard } from './NewCard';
