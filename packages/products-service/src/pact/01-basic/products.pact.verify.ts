import "reflect-metadata";
import { Verifier } from "@pact-foundation/pact";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { INestApplication } from "@nestjs/common";
import { PACT_URLS } from "../pact-paths";

let app: INestApplication;
let port: number;

beforeAll(async () => {
  app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(0); // OS picks a free port
  port = app.getHttpServer().address().port;
});

afterAll(async () => {
  await app.close();
});

describe("Products Service — Pact Verification", () => {
  it("satisfies all consumer contracts", async () => {
    const verifier = new Verifier({
      provider: "ProductsService",
      providerBaseUrl: `http://localhost:${port}`,

      pactUrls: [PACT_URLS.ordersService],
    });

    await expect(verifier.verifyProvider()).resolves.toBeTruthy();
  }, 30000);
});
