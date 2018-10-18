module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['react', 'jsx-a11y', 'import', 'prettier'],
  env: {
    node: true,
    browser: true,
    jest: true
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-use-before-define': 0,
    'lines-between-class-members': 0,
    'import/prefer-default-export': 0,
    'no-console': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0
  }
};
