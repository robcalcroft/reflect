module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  env: {
    browser: true,
  },
  rules: {
    'prettier/prettier': 2,
    'react/jsx-filename-extension': [2, { extensions: ['.js'] }],
  },
};
