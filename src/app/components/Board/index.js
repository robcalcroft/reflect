import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { Query, withApollo } from 'react-apollo';
import { DragDropContext } from 'react-beautiful-dnd';
import { GET_LISTS, UPDATE_CARD_POSITIONS } from '../../queries';
import List from '../List';
import './style.css';

function Board({
  name,
  createdAt,
  client,
  lists,
  listsError,
  listsLoading,
  boardId,
}) {
  function handleUpdateCardPositions(dragEndArguments) {
    if (!dragEndArguments.destination) return;

    const listId = dragEndArguments.source.droppableId;
    const { cards } = lists.find(list => list.id === listId);
    const [removed] = cards.splice(dragEndArguments.source.index, 1);
    cards.splice(dragEndArguments.destination.index, 0, removed);
    const cardsWithUpdatedPosition = cards.map((card, index) => {
      return {
        ...card,
        position: index,
      };
    });

    client.mutate({
      mutation: UPDATE_CARD_POSITIONS,
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
    <div>
      <div>{name}</div>
      <div>Created {distanceInWordsToNow(new Date(Number(createdAt)))} ago</div>
      {listsError && `Error ${listsError}`}
      {listsLoading && lists.length === 0 && 'Loading...'}
      <DragDropContext onDragEnd={handleUpdateCardPositions}>
        <div className="board__container">
          <div className="board__container__inner">
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
                  boardId={boardId}
                  name={listName}
                  createdAt={listCreatedAt}
                  cards={cards}
                />
              )
            )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

Board.defaultProps = {
  listsError: undefined,
};

Board.propTypes = {
  name: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  client: PropTypes.shape({
    mutate: PropTypes.func.isRequired,
  }).isRequired,
  listsLoading: PropTypes.bool.isRequired,
  listsError: PropTypes.string,
  lists: PropTypes.arrayOf(PropTypes.object).isRequired,
  boardId: PropTypes.string.isRequired,
};

function BoardWithLists(props) {
  const { id } = props;
  return (
    <Query query={GET_LISTS} variables={{ boardId: id }}>
      {({ loading, error, data }) => (
        <Board
          {...props}
          boardId={id}
          listsLoading={loading}
          listsError={error}
          lists={(data && data.lists) || []}
        />
      )}
    </Query>
  );
}

BoardWithLists.propTypes = {
  id: PropTypes.string.isRequired,
};

export default withApollo(BoardWithLists);
