import { Link } from '@reach/router';
import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Spinner from '../Spinner';

const GET_BOARDS = gql`
  query boards {
    boards {
      id
      name
      createdAt
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_BOARDS);

  if (loading) return <Spinner />;
  if (error) return `Error ${error.message}`;

  return (
    <>
      <h2>Boards</h2>
      <ul>
        {data.boards.map(({ id, name, createdAt }) => {
          const date = new Date(Number(createdAt));
          return (
            <li key={id}>
              <Link to={`boards/${id}`}>{name}</Link>{' '}
              <small>
                <time
                  itemProp="dateCreated datePublished pubdate"
                  dateTime={date.toISOString().split('T', 1)[0]}
                >
                  ({date.toLocaleDateString()})
                </time>
              </small>
            </li>
          );
        })}
      </ul>
    </>
  );
}
