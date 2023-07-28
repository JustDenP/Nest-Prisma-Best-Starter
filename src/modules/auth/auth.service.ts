import { Msgs } from '@common/@types/constants/messages';
import { Role } from '@common/@types/enums/common.enum';
import { CryptUtils } from '@common/helpers/crypt';
import { TokenService } from '@modules/@lib/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import { UserRepository } from '@modules/user/user.repository';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { UserLoginDTO } from './dto/user-login.dto';
import { IAuthenticationResponse } from './types/auth-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * It takes an email and a password, and returns the user if the password is correct
   */
  async validateUser(isPasswordLogin: boolean, email: string, password?: string): Promise<User> {
    const user: User = await this.userRepository._findFirst(
      {
        where: {
          email,
          deletedAt: null,
        },
      },
      true,
    );
    if (!user) throw new UnauthorizedException(Msgs.exception.wrongCredentials);
    if (!user.isActive) throw new ForbiddenException(Msgs.exception.inactiveUser);

    if (isPasswordLogin) {
      const isValid = await CryptUtils.validateHash(password, user.password);
      if (!isValid) throw new UnauthorizedException(Msgs.exception.wrongCredentials);
    }

    return user;
  }

  /**
   * Validate the user, if the user is valid, we generate an access token and a refresh token
   */
  async login(credentials: UserLoginDTO, isPasswordLogin = true): Promise<IAuthenticationResponse> {
    const user = await this.validateUser(isPasswordLogin, credentials.email, credentials.password);
    const updatedUser = await this.userRepository._update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const accessToken = await this.tokenService.generateAccessToken(updatedUser);
    const refreshToken = await this.tokenService.generateRefreshToken(updatedUser);

    return {
      user: {
        id: updatedUser.id,
      },
      accessToken: accessToken,
      ...(refreshToken ? { refresh_token: refreshToken } : {}),
    };
  }

  /**
   * Register new user
   */
  public register(data: RegisterUserDTO) {
    const user: Prisma.UserCreateInput = {
      ...data,
      role: Role.USER,
    };
    const newUser = this.userRepository._create({ data: user });

    return newUser;
  }
}
