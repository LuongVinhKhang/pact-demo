import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: '1', name: 'Laptop', price: 999.99, inStock: true },
    { id: '2', name: 'Mouse',  price: 29.99,  inStock: true },
  ];

  findById(id: string): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }
}
