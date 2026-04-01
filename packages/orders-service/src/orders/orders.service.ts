import { Injectable, BadRequestException } from "@nestjs/common";
import { ProductsClient } from "../products.client";
import { Order } from "./order.model";

@Injectable()
export class OrdersService {
  private orders: Order[] = [];
  private nextId = 1;
  private productsClient: ProductsClient;

  constructor() {
    const productsBaseUrl = process.env.PRODUCTS_URL || "http://localhost:3001";
    const serviceKey = process.env.INTERNAL_SERVICE_KEY || "internal-service-key-2024";
    this.productsClient = new ProductsClient(productsBaseUrl, serviceKey);
  }

  async createOrder(productId: string, quantity: number): Promise<Order> {
    if (!productId || quantity < 1) {
      throw new BadRequestException("productId and quantity (>= 1) are required");
    }

    const product = await this.productsClient.getProduct(productId);

    if (!product.inStock) {
      throw new BadRequestException(`Product "${product.name}" is out of stock`);
    }

    const order: Order = {
      id: String(this.nextId++),
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      status: "created",
      createdAt: new Date().toISOString(),
    };

    this.orders.push(order);
    return order;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }
}
