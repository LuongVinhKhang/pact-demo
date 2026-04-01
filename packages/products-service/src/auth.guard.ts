import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly validServiceKey =
    process.env.INTERNAL_SERVICE_KEY || "internal-service-key-2024";

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const [scheme, key] = authHeader.split(" ");

    if (scheme !== "Bearer" || key !== this.validServiceKey) {
      throw new UnauthorizedException("Invalid service key");
    }

    return true;
  }
}
