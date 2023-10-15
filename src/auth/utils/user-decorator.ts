import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export type RequestUser = {
  id: number;
  username?: string;
  email?: string;
};

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
