import { Router as ReachRouter } from '@reach/router';
import * as React from 'react';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Board from './pages/Board';

export default function Router() {
  return (
    <ReachRouter>
      <NotFound default />
      <Home path="/" />
      <Board path="boards/:id" />
    </ReachRouter>
  );
}
