// pact.config.ts
export const brokerConfig = {
  brokerUrl: process.env.PACT_BROKER_URL,
  brokerToken: process.env.PACT_BROKER_TOKEN,
  brokerUsername: process.env.PACT_BROKER_USERNAME,
  brokerPassword: process.env.PACT_BROKER_PASSWORD,
  consumerVersion: process.env.GIT_COMMIT ?? "local",
  consumerVersionBranch: process.env.GIT_BRANCH ?? "local",
};

const hasBrokerAuth =
  brokerConfig.brokerUrl &&
  (brokerConfig.brokerToken || (brokerConfig.brokerUsername && brokerConfig.brokerPassword));

// NOTE: PactV3 does not support broker publishing via constructor options.
// Publishing is handled by jest.pact.publish.js (globalTeardown).
// This export is kept for reference only — it is not used by PactV3.
export const publishOptions = undefined;

// Used by the provider Verifier to read pacts from the broker.
// Supports both Bearer token (PactFlow) and Basic auth (self-hosted broker).
export const canDeployOptions = hasBrokerAuth
  ? {
      pactBrokerUrl: brokerConfig.brokerUrl as string,
      ...(brokerConfig.brokerToken
        ? { pactBrokerToken: brokerConfig.brokerToken }
        : {
            pactBrokerUsername: brokerConfig.brokerUsername as string,
            pactBrokerPassword: brokerConfig.brokerPassword as string,
          }),
    }
  : undefined;

