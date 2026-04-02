import path from "path";

// Anchor to the products-service package root (where package.json lives),
// then navigate to the shared pacts folder at the monorepo root.
const packageRoot = path.resolve(__dirname, "../../"); // src/pact → packages/products-service
const pactDir = path.resolve(packageRoot, "../../pacts"); // packages/products-service → pact-demo/pacts

export const PACT_URLS = {
  ordersService: path.join(pactDir, "OrdersService-ProductsService.json"),
};
