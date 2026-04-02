import "reflect-metadata";
import { Verifier } from "@pact-foundation/pact";
import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../app.module";
import { ProductsService } from "../../products/products.service";
import { PACT_URLS } from "../pact-paths";

let app: INestApplication;
let port: number;

beforeAll(async () => {
  app = await NestFactory.create(AppModule, { logger: false });

  // Get the service and register the state endpoint directly on the HTTP adapter.
  // No extra module or controller needed — production code stays untouched.
  const productsService = app.get(ProductsService);
  app.getHttpAdapter().post("/_pact/provider-states", (req: any, res: any) => {
    let raw = '';
    req.on('data', (chunk: any) => (raw += chunk));
    req.on('end', () => {
      const { state } = JSON.parse(raw || '{}');
      switch (state) {
        case "products exist":
        case "product with ID 1 exists":
          (productsService as any)["products"] = [
            { id: "1", name: "Laptop", price: 999.99, inStock: true },
          ];
          break;
        case "no products exist":
          (productsService as any)["products"] = [];
          break;
        case "product with ID 2 is out of stock":
          (productsService as any)["products"] = [
            { id: "2", name: "Laptop", price: 999.99, inStock: false },
          ];
          break;
      }
      res.sendStatus(200);
    });
  });

  await app.listen(0);
  port = app.getHttpServer().address().port;
});

afterAll(async () => {
  await app.close();
});

describe("Products Service — Pact Verification (providerStatesSetupUrl)", () => {
  it("satisfies all consumer contracts", async () => {
    const verifier = new Verifier({
      provider: "ProductsService",
      providerBaseUrl: `http://localhost:${port}`,
      pactUrls: [PACT_URLS.ordersService],
      logLevel: "error",
      providerStatesSetupUrl: `http://localhost:${port}/_pact/provider-states`,
    });

    await expect(verifier.verifyProvider()).resolves.toBeTruthy();
  }, 30000);
});
