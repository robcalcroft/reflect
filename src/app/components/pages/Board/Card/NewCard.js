import React from 'react';
import PropTypes from 'prop-types';
import useInput from 'react-use-input';
import { useMutation } from '@apollo/react-hooks';
import { NEW_CARD } from '../../../../queries';
import modifyCards from '../../../../modifyCards';
import './style.css';

function NewCard({ listId, newPosition }) {
  const [body, setBody, setBodyWithoutEvent] = useInput();
  const [creatingNewCard, setCreatingNewCard] = React.useState(false);
  const [createNewCard] = useMutation(NEW_CARD);

  function handleSubmit(event) {
    event.preventDefault();
    const tempId = Math.floor(Math.random() * Math.floor(10e5)).toString();

    if (!body) {
      alert('Nope');
      return;
    }

    setBodyWithoutEvent('');
    setCreatingNewCard(true);

    createNewCard({
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
  listId: PropTypes.string.isRequired,
  newPosition: PropTypes.number.isRequired,
};

export default NewCard;
