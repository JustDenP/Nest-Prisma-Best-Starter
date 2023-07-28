import { Msgs } from '@common/@types/constants/messages';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { UserRepository } from '@modules/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getString('token.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  /**
   * @description Validate the token and return the user
   * @returns User
   */
  async validate(payload: JwtPayload) {
    const { sub } = payload;
    // Validate the user by id from token
    const user = await this.userRepository._findFirst({ where: { id: Number(sub) } });

    if (!user) throw new UnauthorizedException(Msgs.exception.unauthorized);

    return user;
  }
}
