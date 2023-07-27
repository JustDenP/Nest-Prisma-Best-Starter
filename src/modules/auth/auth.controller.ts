import { TokenService } from '@modules/@lib/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import { Body, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Controller_ } from './decorators/auth-controller.decorator';
import { RefreshTokenDTO } from './dto/token.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { IAuthenticationResponse } from './types/auth-response';

@Controller_('auth', false)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @ApiOperation({ summary: 'Register user' })
  @HttpCode(201)
  @Post('register')
  async register(@Body() data: RegisterUserDTO) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  login(@Body() credentials: UserLoginDTO): Promise<IAuthenticationResponse> {
    return this.authService.login(credentials);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @Post('token/refresh')
  async refresh(@Body() body: RefreshTokenDTO): Promise<any> {
    const token = await this.tokenService.createAccessTokenFromRefreshToken(body.refreshToken);

    return token;
  }
}
