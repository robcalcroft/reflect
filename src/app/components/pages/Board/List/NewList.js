import React from 'react';
import PropTypes from 'prop-types';
import useInput from 'react-use-input';
import { useMutation } from '@apollo/react-hooks';
import { NEW_LIST, GET_BOARD } from '../../../../queries';

function NewList({ boardId }) {
  const [listName, setListName, setListNameRaw] = useInput();
  const [creatingNewList, setCreatingNewList] = React.useState(false);
  const [createNewList] = useMutation(NEW_LIST);

  function handleSubmit(event) {
    event.preventDefault();

    if (!listName) {
      alert('Nope');
      return;
    }

    const tempId = Math.floor(Math.random() * Math.floor(10e5)).toString();
    setCreatingNewList(true);
    setListNameRaw('');

    createNewList({
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
  boardId: PropTypes.string.isRequired,
};

export default NewList;
