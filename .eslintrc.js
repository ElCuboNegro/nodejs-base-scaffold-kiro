/**
 * ESLint configuration for AI Voice Verification Agent
 * Enforces Google JavaScript Style Guide standards
 *
 * @fileoverview ESLint configuration with Google standards
 */

module.exports = {
  extends: ['google'],
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Google JavaScript Style Guide overrides for financial services
    'max-len': [
      'error',
      {
        code: 80,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
    'valid-jsdoc': [
      'error',
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: true,
        requireReturnDescription: true,
        matchDescription: '.+',
      },
    ],
    // Additional rules for security and quality
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'rest-spread-spacing': ['error', 'never'],
    // Security-specific rules
    'no-buffer-constructor': 'error',
    'no-path-concat': 'error',
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      rules: {
        'no-console': 'off',
        'require-jsdoc': 'off',
        'max-len': ['error', {code: 120}],
      },
    },
    {
      files: ['scripts/**/*.js'],
      rules: {
        'no-console': 'off',
        'max-len': ['error', {code: 100}],
      },
    },
  ],
};
