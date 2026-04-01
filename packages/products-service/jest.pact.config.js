module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.pact.verify.ts'],
  silent: true,           // suppresses ALL console output
  verbose: false,         // hides individual test names
};
