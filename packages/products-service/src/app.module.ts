import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ProductsController } from "./products/products.controller";
import { ProductsService } from "./products/products.service";
import { AuthGuard } from "./auth.guard";

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
