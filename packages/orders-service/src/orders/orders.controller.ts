import { Controller, Get, Post, Param, Body, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: { productId: string; quantity: number }) {
    return this.ordersService.createOrder(body.productId, body.quantity);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const order = this.ordersService.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
}
