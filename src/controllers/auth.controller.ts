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
import {
  LoginSchema,
  OnboardUserSchema,
} from 'src/utils/inputValidationSchema';
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
    await this.authService.createUser(
      firstName,
      lastName,
      email,
      password,
      phone,
      isAccountOfficer,
    );

    return this.customResponse(200, 'User created successfully');
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(LoginSchema))
  async login(@Body() loginDto: RegisterDto, @Req() request: ExpressRequest) {
    let { email, password } = loginDto;

    // Check if user exists
    const existingUser = await this.authService.findUserByEmail(email);
    if (!existingUser) {
      return this.throwBadRequest('Invalid email or password');
    }

    // Check if password is correct
    const isPasswordValid = await this.authService.comparePassword(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return this.throwBadRequest('Invalid email or password');
    }

    // // Generate JWT token
    //* Generate JWT token
    const { access_token, refresh_token } =
      await this.authService.tokenGenerator(
        existingUser.email,
        existingUser.id,
      );

    await this.authService.saveRefreshToken(existingUser.id, refresh_token);

    existingUser.password = undefined; // Remove password from user object
    existingUser.id = undefined; // Remove id from user object
    return this.customResponse(200, 'Login successful', {
      user: existingUser,
      access_token,
      refresh_token,
    });
  }
  @Post('logout')
  @HttpCode(200)

  async logout( @Req() request) {

    const user = await this.authService.findUserByEmail(request.user.email);
    if (!user) {
      return this.throwBadRequest('User not found');
    }
  
    await this.authService.logout(user.id);
   
    return this.customResponse(200, 'Logout successful')
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
