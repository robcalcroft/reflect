import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Header = ({ children }) => (
  <div className="header">
    <div className="header__text">{children}</div>
  </div>
);

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
