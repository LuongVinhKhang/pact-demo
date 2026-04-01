import axios from "axios";

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export class ProductsClient {
  constructor(
    private readonly baseUrl: string,
    private readonly serviceKey?: string,
  ) {}

  private get headers() {
    if (!this.serviceKey) return {};
    return { Authorization: `Bearer ${this.serviceKey}` };
  }

  async getProduct(id: string): Promise<Product> {
    const { data } = await axios.get<Product>(`${this.baseUrl}/products/${id}`, {
      headers: this.headers,
    });
    return data;
  }

  async getAllProducts(): Promise<Product[]> {
    const { data } = await axios.get<Product[]>(`${this.baseUrl}/products`, {
      headers: this.headers,
    });
    return data;
  }
}
