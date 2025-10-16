/**
 * Prettier configuration following Google JavaScript Style Guide
 * @see https://google.github.io/styleguide/jsguide.html
 */
module.exports = {
  // Google style preferences
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  trailingComma: 'es5',
  bracketSpacing: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
};
