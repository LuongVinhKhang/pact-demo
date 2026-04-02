import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import path from "path";
import { ProductsClient } from "./products.client";

const { like, eachLike } = MatchersV3;

const provider = new PactV3({
  consumer: "OrdersService",
  provider: "ProductsService",
  dir: path.resolve(__dirname, "../../../pacts"),
  port: 0,
});

const SERVICE_KEY = "internal-service-key-2024";

describe("ProductsService contract", () => {
  it("returns a product when given a valid ID", async () => {
    await provider
      .addInteraction({
        states: [{ description: "product with ID 1 exists" }],
        uponReceiving: "a request for product 1",
        withRequest: {
          method: "GET",
          path: "/products/1",
          headers: {
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        },
        willRespondWith: {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: like({
            id: "1",
            name: "Laptop",
            price: 999.99,
            inStock: true,
          }),
        },
      })
      .executeTest(async (mockServer) => {
        const client = new ProductsClient(mockServer.url, SERVICE_KEY);
        const product = await client.getProduct("1");

        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(typeof product.price).toBe("number");
        expect(typeof product.inStock).toBe("boolean");
      });
  });

  it("returns a list of products", async () => {
    await provider
      .addInteraction({
        states: [{ description: "products exist" }],
        uponReceiving: "a request for all products",
        withRequest: {
          method: "GET",
          path: "/products",
          headers: {
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        },
        willRespondWith: {
          status: 200,
          headers: { "Content-Type": "application/json" },
          body: eachLike({
            id: "1",
            name: "Laptop",
            price: 999.99,
            inStock: true,
          }),
        },
      })
      .executeTest(async (mockServer) => {
        const client = new ProductsClient(mockServer.url, SERVICE_KEY);
        const products = await client.getAllProducts();

        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].id).toBeDefined();
      });
  });

  it("product with ID 999 does not exist", async () => {
    await provider
      .addInteraction({
        states: [{ description: "product with ID 999 is not exist" }],
        uponReceiving: "a request for product 999",
        withRequest: {
          method: "GET",
          path: "/products/999",
          headers: {
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        },
        // willRespondWith body → written to the pact file → verified against the REAL provider later  
        willRespondWith: {
          status: 404,
          headers: { "Content-Type": "application/json" },
          body: {
            "message": "Product 999 not found",
            "error": "Not Found",
            "statusCode": 404
          }
        },
      })
      .executeTest(async (mockServer) => {
        // This will failed since Pact matches on the full request fingerprint
        // const client = new ProductsClient(mockServer.url, SERVICE_KEY);
        // const products = await client.getAllProducts();

        const client = new ProductsClient(mockServer.url, SERVICE_KEY);
        await expect(client.getProduct("999")).rejects.toMatchObject({
          response: { status: 404 },
        });

        // const client = new ProductsClient(mockServer.url,
        //   SERVICE_KEY);
        // try {
        //   await client.getProduct("999");
        // } catch (err: any) {
        //   expect(err.response.status).toBe(404);
        //   expect(err.response.data).toMatchObject({
        //     error: "Not Found",
        //     statusCode: 404,
        //   });
        // }
      });
  });
});
