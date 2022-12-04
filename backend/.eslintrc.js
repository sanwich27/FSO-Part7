module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'no-console': 0,
  },
};
