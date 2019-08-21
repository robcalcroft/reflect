import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import Header from './Header';
import Main from './Main';

const client = new ApolloClient({
  uri: `http://${window.location.hostname}:4000/graphql`,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Header />
      <Main />
    </ApolloProvider>
  );
}
