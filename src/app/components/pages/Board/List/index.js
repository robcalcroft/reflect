import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Droppable } from 'react-beautiful-dnd';
import Card, { NewCard } from '../Card';
import './style.css';

function List({ name, createdAt, cards, id, boardId }) {
  function sortCards({ position: positionOne }, { position: positionTwo }) {
    if (positionOne > positionTwo) return 1;
    if (positionOne < positionTwo) return -1;
    return 0;
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
};

export default React.memo(List);
