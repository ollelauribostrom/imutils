module.exports = {
  "extends": "airbnb",
  "plugins": [
      "react",
      "jsx-a11y",
      "import"
  ],
  "env": {
    "node": true,
    "browser": true
  },
  "rules": {
    "no-console": 0,
    "no-unused-vars": ["error", {
      "varsIgnorePattern": "chai|should",
      "ignoreRestSiblings": true,
    }],
    "import/prefer-default-export": 0
  },
  "globals": {
    "describe": true,
    "before": true,
    "it": true,
    "expect": true,
  },
  "parser": "babel-eslint",
};

