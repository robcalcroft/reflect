import { Redirect } from '@reach/router';
import * as React from 'react';

export default function NotFound() {
  return <Redirect noThrow to="/" />;
}
