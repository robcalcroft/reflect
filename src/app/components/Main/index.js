import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const Main = ({ children }) => <div className="main">{children}</div>;

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
