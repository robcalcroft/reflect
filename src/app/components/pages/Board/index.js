import { Redirect } from '@reach/router';
import React from 'react';
import PropTypes from 'prop-types';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { DragDropContext } from 'react-beautiful-dnd';
import { UPDATE_CARD_POSITIONS, GET_BOARD } from '../../../queries';
import List, { NewList } from './List';
import { NOT_FOUND_CODE } from '../../../../shared/constants';
import Spinner from '../../Spinner';
import './style.css';

function Board(props) {
  const { id } = props;
  const { loading, error, data } = useQuery(GET_BOARD, {
    variables: { id },
  });
  const [updateCardPositions] = useMutation(UPDATE_CARD_POSITIONS);

  if (loading) return <Spinner />;
  if (error) {
    if (error.message.endsWith(NOT_FOUND_CODE)) {
      return <Redirect noThrow to="/" />;
    }
    return `Error ${error.message}`;
  }
  const { createdAt, name, lists } = data.board;

  function handleUpdateCardPositions(dragEndArguments) {
    if (!dragEndArguments.destination) return;
    if (dragEndArguments.destination.index === dragEndArguments.source.index) {
      return;
    }

    const listId = dragEndArguments.source.droppableId;
    const { cards } = lists.find(list => list.id === listId);
    const [removed] = cards.splice(dragEndArguments.source.index, 1);
    cards.splice(dragEndArguments.destination.index, 0, removed);
    const cardsWithUpdatedPosition = cards.map((card, index) => ({
      ...card,
      position: index,
    }));

    updateCardPositions({
      variables: {
        cards: cardsWithUpdatedPosition.map(({ id: cardId, position }) => ({
          id: cardId,
          position,
        })),
      },
      optimisticResponse: {
        updateCardPositions: cardsWithUpdatedPosition,
      },
    });
  }

  return (
    <>
      <h2>{name}</h2>
      <div>Created {formatDistanceToNow(new Date(Number(createdAt)))} ago</div>
      <DragDropContext onDragEnd={handleUpdateCardPositions}>
        <div className="board__container">
          <div className="board__container-inner">
            {lists.map(
              ({
                id: listId,
                name: listName,
                createdAt: listCreatedAt,
                cards,
              }) => (
                <List
                  key={`list${listId}`}
                  id={listId}
                  boardId={id}
                  name={listName}
                  createdAt={listCreatedAt}
                  cards={cards}
                />
              )
            )}
            <NewList boardId={id} />
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

Board.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Board;
