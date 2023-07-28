import { CreateUserDTO } from '@modules/user/dto/create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class RegisterUserDTO extends OmitType(CreateUserDTO, ['role'] as const) {}
