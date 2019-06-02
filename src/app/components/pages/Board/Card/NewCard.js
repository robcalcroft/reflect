import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { NEW_CARD } from '../../../../queries';
import './style.css';
import modifyCards from '../../../../modifyCards';

function useInput(initialState = '', valueKey = 'value') {
  const [value, setValue] = useState(initialState);

  function setValueFromEvent(event) {
    setValue(event.target[valueKey]);
  }

  return [value, setValueFromEvent, setValue];
}

function NewCard({ client, listId, newPosition }) {
  const [body, setBody, setBodyWithoutEvent] = useInput();
  const [creatingNewCard, setCreatingNewCard] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const tempId = Math.floor(Math.random() * Math.floor(10e5)).toString();

    if (!body) {
      alert('Nope');
      return;
    }

    setBodyWithoutEvent('');
    setCreatingNewCard(true);

    client
      .mutate({
        mutation: NEW_CARD,
        variables: {
          body,
          listId,
          position: newPosition + 1,
        },
        optimisticResponse: {
          newCard: {
            body,
            createdAt: new Date().getTime().toString(),
            id: tempId,
            position: newPosition + 1,
            __typename: 'Card',
          },
        },
        update(
          proxy,
          {
            data: { newCard },
          }
        ) {
          modifyCards({
            proxy,
            listId,
            modify(cards) {
              cards.push({ ...newCard });
              return cards;
            },
          });
        },
      })
      .then(() => setCreatingNewCard(false))
      .catch(error => alert(error.message));
  }

  return (
    <form onSubmit={handleSubmit} className="card card--new">
      <label htmlFor="body">
        What do you want to say?
        <textarea
          autoComplete="off"
          id="body"
          onChange={setBody}
          rows="3"
          value={body}
        />
      </label>
      <button disabled={creatingNewCard} type="submit">
        Create card
      </button>
    </form>
  );
}

NewCard.propTypes = {
  client: PropTypes.shape({
    mutate: PropTypes.func.isRequired,
  }).isRequired,
  listId: PropTypes.string.isRequired,
  newPosition: PropTypes.number.isRequired,
};

export default withApollo(NewCard);
