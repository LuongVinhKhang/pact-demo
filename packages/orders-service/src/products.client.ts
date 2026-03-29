import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export class ProductsClient {
  constructor(private readonly baseUrl: string) {}

  async getProduct(id: string): Promise<Product> {
    const { data } = await axios.get<Product>(`${this.baseUrl}/products/${id}`);
    return data;
  }

  async getAllProducts(): Promise<Product[]> {
    const { data } = await axios.get<Product[]>(`${this.baseUrl}/products`);
    return data;
  }
}
