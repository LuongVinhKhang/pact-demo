// pact.config.ts
export const brokerConfig = {
  brokerUrl: process.env.PACT_BROKER_URL,
  brokerToken: process.env.PACT_BROKER_TOKEN,
  consumerVersion: process.env.GIT_COMMIT ?? "local",
  consumerVersionBranch: process.env.GIT_BRANCH ?? "local",
};

export const publishOptions =
  brokerConfig.brokerUrl && brokerConfig.brokerToken
    ? {
        pactBrokerUrl: brokerConfig.brokerUrl,
        pactBrokerToken: brokerConfig.brokerToken,
        consumerVersion: brokerConfig.consumerVersion,
        consumerVersionBranch: brokerConfig.consumerVersionBranch,
      }
    : undefined;

export const canDeployOptions =
  brokerConfig.brokerUrl && brokerConfig.brokerToken
    ? {
        pactBrokerUrl: brokerConfig.brokerUrl,
        pactBrokerToken: brokerConfig.brokerToken,
      }
    : undefined;
