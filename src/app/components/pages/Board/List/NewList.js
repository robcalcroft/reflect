import React from 'react';
import PropTypes from 'prop-types';
import useInput from 'react-use-input';
import { withApollo } from 'react-apollo';
import { NEW_LIST, GET_BOARD } from '../../../../queries';

function NewList({ client, boardId }) {
  const [listName, setListName, setListNameRaw] = useInput();
  const [creatingNewList, setCreatingNewList] = React.useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!listName) {
      alert('Nope');
      return;
    }

    const tempId = Math.floor(Math.random() * Math.floor(10e5)).toString();
    setCreatingNewList(true);
    setListNameRaw('');

    client
      .mutate({
        mutation: NEW_LIST,
        variables: {
          name: listName,
          boardId,
        },
        optimisticResponse: {
          newList: {
            id: tempId,
            name: listName,
            createdAt: new Date().getTime().toString(),
            __typename: 'List',
          },
        },
        update(
          proxy,
          {
            data: { newList },
          }
        ) {
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
                  lists: [
                    ...data.board.lists,
                    {
                      ...newList,
                      cards: [],
                    },
                  ],
                },
              },
            });
          } catch (error) {
            window.location.reload();
          }
        },
      })
      .then(() => setCreatingNewList(false))
      .catch(error => alert(error.message));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={listName} onChange={setListName} />
      <button type="submit" disabled={creatingNewList}>
        Create list
      </button>
    </form>
  );
}

NewList.propTypes = {
  client: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  boardId: PropTypes.string.isRequired,
};

export default withApollo(NewList);
