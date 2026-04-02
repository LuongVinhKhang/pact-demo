# Pact Provider Verification — Examples

This folder contains provider-side Pact verification tests for `ProductsService`, organized from simplest to most complete.

---

## 01-basic

**File:** `products.pact.verify.ts`

The simplest possible verification. No state setup — works because `ProductsService` ships with hardcoded seed data.

```
Verifier → GET /products
         ← 200 OK
```

**When to use:** Quick smoke-check. Suitable only when your provider always has the required data available.

---

## 02-state-handlers

**File:** `products-stateHandlers.pact.verify.ts`

Uses `stateHandlers` — in-process callbacks that run before each interaction. The Pact verifier calls your function directly (no HTTP involved).

```
stateHandlers["products exist"]()  ← Pact calls this first
Verifier → GET /products
         ← 200 OK
```

**How state is set:** The test grabs `ProductsService` from the NestJS DI container via `app.get()` and manipulates its internal `products` array directly.

**When to use:** JS/TS providers — this is the **recommended approach**. Simple, no extra infrastructure needed.

---

## 03-provider-states-url

**File:** `products-providerStates.pact.verify.ts`

Uses `providerStatesSetupUrl` — the Pact verifier POSTs the state name to an HTTP endpoint on the running provider before each interaction.

```
Verifier → POST /_pact/provider-states { "state": "products exist" }
         ← 200 OK
Verifier → GET /products
         ← 200 OK
```

**How state is set:** After `NestFactory.create()`, `ProductsService` is retrieved via `app.get()` and the state endpoint is registered directly on the Express adapter — no extra controller or module needed.

**When to use:**
- Non-JS providers (Java, Go, etc.) where in-process callbacks aren't possible
- Verifying against a deployed provider rather than a locally started one

---

## Port strategy

All examples use port `0` so the OS assigns a free port automatically — no hardcoded ports, no conflicts when running in parallel.

```typescript
await app.listen(0);
const port = app.getHttpServer().address().port;
```

---

## Key takeaway

| Approach | Production code touched? | Recommended for JS/TS? |
|---|---|---|
| 01-basic | No | Only if data is always seeded |
| 02-state-handlers | No | Yes |
| 03-provider-states-url | No | Only when HTTP-based setup is required |
