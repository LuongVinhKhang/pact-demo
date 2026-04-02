import "reflect-metadata";
import { Verifier } from "@pact-foundation/pact";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../app.module";
import { INestApplication } from "@nestjs/common";
import { ProductsService } from "../../products/products.service";
import { PACT_URLS } from "../pact-paths";

let app: INestApplication;
let port: number;
let productsService: ProductsService;

beforeAll(async () => {
  app = await NestFactory.create(AppModule, { logger: false });
  await app.listen(0); // OS picks a free port
  port = app.getHttpServer().address().port;
  productsService = app.get(ProductsService);
});

afterAll(async () => {
  await app.close();
});

describe("Products Service — Pact Verification (stateHandlers)", () => {
  it("satisfies all consumer contracts", async () => {
    const verifier = new Verifier({
      provider: "ProductsService",
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [PACT_URLS.ordersService],
      logLevel: "error",
      stateHandlers: {
        "products exist": async () => {
          (productsService as any)["products"] = [
            { id: "1", name: "Laptop", price: 999.99, inStock: true },
          ];
        },
        "product with ID 1 exists": async () => {
          (productsService as any)["products"] = [
            { id: "1", name: "Laptop", price: 999.99, inStock: true },
          ];
        },
      },

      beforeEach: async () => {
        (productsService as any)["products"] = [];
      },
    });

    await expect(verifier.verifyProvider()).resolves.toBeTruthy();
  }, 30000);
});
