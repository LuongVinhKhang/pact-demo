import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
