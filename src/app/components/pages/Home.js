import { Link } from '@reach/router';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

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
  return (
    <>
      <h2>Boards</h2>
      <Query query={GET_BOARDS}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error ${error.message}`;

          return (
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
          );
        }}
      </Query>
    </>
  );
}
