
const tsPreset = require('ts-jest/jest-preset')
const dynamodbPreset = require('@shelf/jest-dynamodb/jest-preset')

module.exports = {
  ...tsPreset,
  ...dynamodbPreset,
  testEnvironment: 'node',
};
