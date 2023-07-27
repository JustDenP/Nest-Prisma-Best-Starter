import { User } from '@prisma/client';
import type { Request } from 'express';

interface IRequestWithUser extends Request {
  user: User;
}

export default IRequestWithUser;
