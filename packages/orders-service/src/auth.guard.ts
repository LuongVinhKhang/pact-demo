import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly validApiKey = process.env.USER_API_KEY || "user-api-key-2024";

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    // Expect format: "Bearer <api-key>"
    const [scheme, key] = authHeader.split(" ");

    if (scheme !== "Bearer" || key !== this.validApiKey) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }
}
