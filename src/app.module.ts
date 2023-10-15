import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ActivityModule } from './activity/activity.module';
import { jwtConstants } from './auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { PostModule } from './post/post.module';
import { InformationBoardModule } from './information-board/information-board.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ActivityModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '6000s',
      },
    }),
    PostModule,
    InformationBoardModule,
    ChatModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    ChatGateway,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
