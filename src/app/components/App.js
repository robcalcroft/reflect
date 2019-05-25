import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import Container from './Container';
import Header from './Header';
import Main from './Main';
import Board from './Board';

const client = new ApolloClient({
  uri: `http://${window.location.hostname}:4000/graphql`,
});

const GET_BOARDS = gql`
  query boards {
    boards {
      createdAt
      id
      name
    }
  }
`;

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Container>
        <Header />
        <Main>
          <Query query={GET_BOARDS}>
            {({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error ${error.message}`;

              return data.boards.map(({ id, name, createdAt }) => (
                <Board
                  key={`board${id}`}
                  id={id}
                  name={name}
                  createdAt={createdAt}
                />
              ));
            }}
          </Query>
        </Main>
      </Container>
    </ApolloProvider>
  );
}
