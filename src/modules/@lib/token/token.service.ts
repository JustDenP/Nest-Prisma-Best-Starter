import { Msgs } from '@common/@types/constants/messages';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { UserRepository } from '@modules/user/user.repository';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(
    private readonly userRepository: UserRepository,
    public readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
  ) {}

  private readonly BASE_OPTIONS: JwtSignOptions = {
    issuer: 'myapp',
    audience: 'myapp',
  };

  /**
   * Generate access token
   */
  async generateAccessToken(user: User): Promise<string> {
    const toPayload = {
      role: user.role,
    };
    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: this.configService.getNumber('token.jwtAccessExpirationTime'),
    };

    return this.jwtService.signAsync(toPayload, options);
  }

  /**
   * Generate refresh token
   */
  async generateRefreshToken(user: User): Promise<string> {
    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: this.configService.getNumber('token.jwtRefreshExpirationTime'),
    };

    return this.jwtService.signAsync({}, options);
  }

  /**
   * Takes the encoded refresh token, decodes it, finds and returns the user
   */
  async resolveRefreshToken(encoded: string): Promise<User> {
    try {
      const decoded = await this.verifyToken(encoded);
      const user = await this.getUserFromRefreshTokenPayload(decoded);

      if (!user) throw new Error();
      if (!user.isActive || user.deletedAt) throw new ForbiddenException(Msgs.exception.forbidden);

      return user;
    } catch (error) {
      throw new UnauthorizedException(Msgs.exception.malformed);
    }
  }

  /**
   * Decodes the refresh token and throws an error if the token is expired or malformed
   */
  verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      throw error instanceof TokenExpiredError
        ? new UnauthorizedException(Msgs.exception.expired)
        : new UnauthorizedException(Msgs.exception.malformed);
    }
  }

  /**
   * Takes a refresh token payload, extracts the user ID, and returns the user
   */
  async getUserFromRefreshTokenPayload(payload: JwtPayload): Promise<User> {
    const subId = payload.sub;
    if (!subId) throw new UnauthorizedException(Msgs.exception.malformed);

    return this.userRepository._findFirst({
      where: {
        id: Number(subId),
      },
    });
  }

  /**
   * It takes a refresh token, resolves it, and generates an access token for that user
   */
  async createAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.resolveRefreshToken(refreshToken);
    const token = await this.generateAccessToken(user);

    return { token, user };
  }
}
