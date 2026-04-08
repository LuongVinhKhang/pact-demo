module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/02-*/*.pact.verify.ts", "**/03-*/*.pact.verify.ts"],
  silent: true, // suppresses ALL console output
  verbose: false, // hides individual test names
};
