import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './middleware/prisma';
import { AuthController } from './controllers/auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorInterceptor } from './middleware/errorHandler';
import { AuthGuard } from './middleware/auth.guard';
import { AccountsService } from './services/accounts.service';
import { AuthService } from './services/auth.service';
import { AccountsController } from './controllers/accounts.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.APP_SECRET,
      global: true, // Replace with your secret key
      signOptions: { expiresIn: process.env.APP_SECRET_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController, AccountsController],
  providers: [
    PrismaService,
    AccountsService,
    AuthService,
    AuthGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
