/**
 * Jest globalTeardown — publishes generated pact files to the Pact Broker.
 * Only runs when PACT_BROKER_URL is set along with either:
 *   - PACT_BROKER_TOKEN (Bearer auth — PactFlow / hosted brokers)
 *   - PACT_BROKER_USERNAME + PACT_BROKER_PASSWORD (Basic auth — self-hosted broker)
 * Uses the Pact Broker's REST API directly (no extra dependencies required).
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

module.exports = async function () {
  const brokerUrl = process.env.PACT_BROKER_URL;
  const brokerToken = process.env.PACT_BROKER_TOKEN;
  const brokerUsername = process.env.PACT_BROKER_USERNAME;
  const brokerPassword = process.env.PACT_BROKER_PASSWORD;
  const consumerVersion = process.env.GIT_COMMIT ?? "local";
  const consumerVersionBranch = process.env.GIT_BRANCH ?? "local";

  if (!brokerUrl) return;
  if (!brokerToken && !(brokerUsername && brokerPassword)) return;

  // Build the Authorization header — Bearer for PactFlow, Basic for self-hosted
  const authHeader = brokerToken
    ? `Bearer ${brokerToken}`
    : `Basic ${Buffer.from(`${brokerUsername}:${brokerPassword}`).toString("base64")}`;

  const pactsDir = path.resolve(__dirname, "../../pacts");
  const pactFiles = fs.readdirSync(pactsDir).filter((f) => f.endsWith(".json"));

  for (const file of pactFiles) {
    const pactContent = fs.readFileSync(path.join(pactsDir, file), "utf8");
    const pact = JSON.parse(pactContent);
    const consumer = pact.consumer.name;
    const provider = pact.provider.name;

    const url = new URL(
      `/pacts/provider/${encodeURIComponent(provider)}/consumer/${encodeURIComponent(consumer)}/version/${encodeURIComponent(consumerVersion)}`,
      brokerUrl
    );

    await put(url.toString(), pactContent, authHeader);

    // Tag the version with the branch name (compatible with all broker versions)
    const branchUrl = new URL(
      `/pacticipants/${encodeURIComponent(consumer)}/versions/${encodeURIComponent(consumerVersion)}/tags/${encodeURIComponent(consumerVersionBranch)}`,
      brokerUrl
    );
    await put(branchUrl.toString(), "{}", authHeader);

    console.log(`Published pact: ${consumer} -> ${provider} @ ${consumerVersion} (${consumerVersionBranch})`);
  }
};

function put(url, body, authHeader) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;
    const data = Buffer.from(body, "utf8");

    const req = lib.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
          Authorization: authHeader,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`PUT ${url} → ${res.statusCode}: ${body.slice(0, 200)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}
