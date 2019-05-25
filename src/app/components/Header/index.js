import { Link } from '@reach/router';
import React from 'react';
import './style.css';

export default function Header() {
  return (
    <div className="header">
      <h1 className="header__text">
        <Link className="header__link" to="/">
          Reflect
        </Link>
      </h1>
    </div>
  );
}
