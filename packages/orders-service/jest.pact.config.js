module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.pact.spec.ts"],
  silent: true, // suppresses ALL console output
  verbose: false, // hides individual test names
};
