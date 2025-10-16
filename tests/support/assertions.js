/**
 * Simple assertion utilities for Cucumber step definitions
 * Replaces Jest expect() calls with Node.js assert
 * Follows Google JavaScript Style Guide standards
 */

const assert = require('assert');

/**
 * Assert that a value is truthy
 * @param {*} actual - The actual value
 * @param {string} message - Error message if assertion fails
 */
function assertTruthy(actual, message) {
  assert(actual, message || `Expected ${actual} to be truthy`);
}

/**
 * Assert that a value is defined (not undefined)
 * @param {*} actual - The actual value
 * @param {string} message - Error message if assertion fails
 */
function assertDefined(actual, message) {
  assert(actual !== undefined, message || `Expected value to be defined`);
}

/**
 * Assert that two values are equal
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} message - Error message if assertion fails
 */
function assertEqual(actual, expected, message) {
  assert.strictEqual(
    actual,
    expected,
    message || `Expected ${actual} to equal ${expected}`
  );
}

/**
 * Assert that a string contains a substring
 * @param {string} actual - The actual string
 * @param {string} expected - The expected substring
 * @param {string} message - Error message if assertion fails
 */
function assertContains(actual, expected, message) {
  assert(
    actual && actual.includes && actual.includes(expected),
    message || `Expected "${actual}" to contain "${expected}"`
  );
}

/**
 * Assert that a string matches a regular expression
 * @param {string} actual - The actual string
 * @param {RegExp} pattern - The regular expression pattern
 * @param {string} message - Error message if assertion fails
 */
function assertMatches(actual, pattern, message) {
  assert(
    pattern.test(actual),
    message || `Expected "${actual}" to match pattern ${pattern}`
  );
}

/**
 * Assert that a value is greater than another value
 * @param {number} actual - The actual value
 * @param {number} expected - The expected minimum value
 * @param {string} message - Error message if assertion fails
 */
function assertGreaterThan(actual, expected, message) {
  assert(
    actual > expected,
    message || `Expected ${actual} to be greater than ${expected}`
  );
}

/**
 * Assert that a value is not equal to another value
 * @param {*} actual - The actual value
 * @param {*} expected - The value that should not be equal
 * @param {string} message - Error message if assertion fails
 */
function assertNotEqual(actual, expected, message) {
  assert(
    actual !== expected,
    message || `Expected ${actual} to not equal ${expected}`
  );
}

/**
 * Assert that a value is of a specific type
 * @param {*} actual - The actual value
 * @param {string} expectedType - The expected type
 * @param {string} message - Error message if assertion fails
 */
function assertType(actual, expectedType, message) {
  assert(
    typeof actual === expectedType,
    message ||
      `Expected ${actual} to be of type ${expectedType}, got ${typeof actual}`
  );
}

module.exports = {
  assertTruthy,
  assertDefined,
  assertEqual,
  assertContains,
  assertMatches,
  assertGreaterThan,
  assertNotEqual,
  assertType,
};
