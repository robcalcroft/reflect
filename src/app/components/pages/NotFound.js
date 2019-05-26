import { Redirect } from '@reach/router';
import React from 'react';

export default function NotFound() {
  return <Redirect noThrow to="/" />;
}
