import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { RegisterDto } from './DTOs/auth.dto';
import { Request as ExpressRequest, Response } from 'express';
import { JoiValidationPipe } from 'src/middleware/InputValidator';
import { OnboardUserSchema } from 'src/utils/inputValidationSchema';
import { AuthService } from 'src/services/auth.service';
import { AccountsService } from 'src/services/accounts.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
  ) {}

  @Post('register')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(OnboardUserSchema))
  async regsiter(
    @Body() onboardDto: RegisterDto,
    @Req() request: ExpressRequest,
  ) {
    let { phone, firstName, lastName, email, password, isAccountOfficer } =
      onboardDto;

    // Check if user already exists
    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      return {
        status: 409,
        message: 'User already exists',
      };
    }

    // Create user
    const user = await this.authService.createUser(
      firstName,
      lastName,
      email,
      password,
      phone,
      isAccountOfficer,
    );

    return this.customResponse(200, 'User created successfully');
  }

  private customResponse(
    statusCode: number,
    statusMessage: string,
    data?: any,
  ) {
    return {
      statusCode,
      statusMessage,
      data,
    };
  }

  private throwBadRequest(message: string) {
    throw new HttpException(message, 400);
  }
}
