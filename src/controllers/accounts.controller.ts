import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/middleware/InputValidator';
import { AccountsService } from 'src/services/accounts.service';
import {
  createAccountSchema,
  OnboardUserSchema,
} from 'src/utils/inputValidationSchema';
import { createAccountsDto } from './DTOs/accounts.deto';
import { Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from 'src/middleware/auth.guard';
import { AuthService } from 'src/services/auth.service';
import { accountType } from '@prisma/client';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create-account')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(createAccountSchema))
  async createAccount(
    @Body() createAccountDto: createAccountsDto,
    @Request() req,
  ) {
    const { officerId, accountType } = createAccountDto;
    const user = await this.authService.findUserByEmail(req.user.email);
    const officer = await this.authService.findUserById(officerId);

    if (!officer || officer.userType !== 'account_officer') {
      return this.throwBadRequest('Invalid account officer');
    }

    const account = await this.accountsService.createAccount(
      user.id,
      officerId,
      accountType as accountType,
    );

    account.customerId = undefined;
    account.officerId = undefined;
    return this.customResponse(200, 'Account created successfully', account);
  }

  @UseGuards(AuthGuard)
  @Get('fetch-officers')
  @HttpCode(200)
  async fetchAllOfficers(@Request() req: ExpressRequest) {
    const officers = await this.accountsService.fetchAllOfficers();

    officers.forEach((officer) => {
      officer.password = undefined;
      // officer.id = undefined;
    });
    return this.customResponse(
      200,
      'Account officers fetched successfully',
      officers,
    );
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
