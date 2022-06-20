module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: [
    "*.js",
  ],
  "rules": {
    "@typescript-eslint/triple-slash-reference":"off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-unused-vars":"off",
    "no-unused-vars": ['warn', { 'argsIgnorePattern': '^_' }]
  }
}
