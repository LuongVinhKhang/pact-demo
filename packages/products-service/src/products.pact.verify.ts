import "reflect-metadata";
import { Verifier } from "@pact-foundation/pact";
import path from "path";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";

let app: INestApplication;

beforeAll(async () => {
  app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(3001);
});

afterAll(async () => {
  await app.close();
});

describe("Products Service — Pact Verification", () => {
  it("satisfies all consumer contracts", async () => {
    const verifier = new Verifier({
      provider: "ProductsService",
      providerBaseUrl: "http://localhost:3001",

      pactUrls: [path.resolve(__dirname, "../../../pacts/OrdersService-ProductsService.json")],

      stateHandlers: {
        "product with ID 1 exists": async () => {
          // In-memory service already has product 1
        },
        "products exist": async () => {
          // Already seeded
        },
      },
    });

    await expect(verifier.verifyProvider()).resolves.toBeUndefined();
  }, 30000);
});
