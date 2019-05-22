import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { NEW_CARD } from '../../queries';
import './style.css';
import modifyCards from '../../modifyCards';

function useInput(initialState = '', valueKey = 'value') {
  const [value, setValue] = useState(initialState);

  function setValueFromEvent(event) {
    setValue(event.target[valueKey]);
  }

  return [value, setValueFromEvent, setValue];
}

function NewCard({ client, listId, newPosition }) {
  const [name, setName, setNameWithoutEvent] = useInput();
  const [description, setDescription, setDescriptionWithoutEvent] = useInput();
  const [creatingNewCard, setCreatingNewCard] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!name) {
      alert('Nope');
      return;
    }

    setCreatingNewCard(true);

    client
      .mutate({
        mutation: NEW_CARD,
        variables: {
          name,
          description,
          listId,
          position: newPosition + 1,
        },
        update(proxy) {
          const tempId = String(Math.floor(new Date().getTime()));
          modifyCards({
            proxy,
            listId,
            modify(cards) {
              cards.push({
                __typename: 'Card',
                id: tempId,
                name,
                description,
                created_at: tempId,
                position: newPosition + 1,
              });
              return cards;
            },
          });
        },
      })
      .then(() => {
        setCreatingNewCard(false);
        setDescriptionWithoutEvent('');
        setNameWithoutEvent('');
      });
  }

  return (
    <form onSubmit={handleSubmit} className="card card--new">
      <label htmlFor="name">
        <div>Name</div>
        <input id="name" value={name} onChange={setName} autoComplete="off" />
      </label>
      <label htmlFor="name">
        <div>Description</div>
        <input
          id="description"
          value={description}
          onChange={setDescription}
          autoComplete="off"
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
