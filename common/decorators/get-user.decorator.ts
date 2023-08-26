import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: any, req: ExecutionContext): User => {
    return req.switchToHttp().getRequest().user;
  },
);
