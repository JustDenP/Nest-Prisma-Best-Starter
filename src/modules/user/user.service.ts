import { Role } from '@common/@types/enums/common.enum';
import { Injectable } from '@nestjs/common';
import { PageOptionsDTO } from 'database/pagination/page-options.dto';
import { RegisterUserDTO } from './dto/sign/user-register.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getPaginated(pageOptions: PageOptionsDTO) {
    return this.userRepository._getPaginated(pageOptions);
  }

  async register(data: RegisterUserDTO) {
    return this.userRepository._create({
      data: {
        ...data,
        role: Role.USER,
      },
    });
  }
}
