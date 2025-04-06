import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { PrismaService } from 'src/middleware/prisma';
import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';

interface tokenValidity {
  valid: boolean;
  userId?: string;
  email?: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    isAccountOfficer: boolean = false,
  ) {
    let hashedPassword = await this.hashPassword(password);
    if (isAccountOfficer) {
      return this.db.users.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          userType: 'account_officer',
        },
      });
    }

    return this.db.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.db.users.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include:{
        customerAccounts:true,
      }
    });
  }

  //* SAVE RT
  async saveRefreshToken(userId: string, refreshToken: string) {
    const UserInTokenTable = await this.db.userTokens.findFirst({
      where: {
        userId,
      },
    });

    const expiresAt = addDays(new Date(), 7);

    if (UserInTokenTable) {
      return await this.db.userTokens.update({
        where: {
          id: UserInTokenTable.id,
        },
        data: {
          token: refreshToken,
          expiresAt,
        },
      });
    } else {
      return await this.db.userTokens.create({
        data: {
          userId,
          token: refreshToken,
          expiresAt,
        },
      });
    }
  }

  async findUserById(id: string) {
    return await this.db.users.findFirst({
      where: {
        id,
      },
      include:{
        customerAccounts:true,
      }
    });
  }

  async validateRefreshToken(refreshToken: string): Promise<tokenValidity> {
    try {
      // Verify and decode the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.APP_SECRET,
      });

      // console.log(""payload);/

      const userId = payload?.userId; // Assume 'sub' is the userId in the JWT payload
      if (!userId) {
        return {
          valid: false,
        }; // Invalid token payload
      }
      const user = await this.findUserById(userId);

      if (!user) {
        return {
          valid: false,
        }; // Invalid token payload
      }
      // Check the database for the stored token
      const storedToken = await this.db.userTokens.findFirst({
        where: {
          userId,
        },
      });

      if (!storedToken) {
        return {
          valid: false,
        }; // Invalid token payload // No token stored for the user
      }

      // Compare the provided token with the stored token
      if (storedToken.token !== refreshToken) {
        return {
          valid: false,
        }; // Invalid token payload  // Tokens do not match
      }

      // Check if the token has expired
      if (new Date() > storedToken.expiresAt) {
        return {
          valid: false,
        }; // Invalid token payload
      }

      return {
        valid: true,
        userId,
        email: user.email,
      }; // Invalid token payload // Token is valid
    } catch (error) {
      // Handle token verification errors
      console.error(error.message);

      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        return {
          valid: false,
        }; // Invalid token payload
      }

      return {
        valid: false,
      }; // Invalid token payload
    }
  }

  async isNotAdmin(email: string) {
    const initiatingUser = await this.findUserByEmail(email);

    return initiatingUser
  }


  async tokenGenerator(email: string, userId: string) {
    let payload = { email, userId };
    let secondPayload = { userId };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: process.env.APP_SECRET_EXPIRES_IN,
    });
    const refresh_token = this.jwtService.sign(secondPayload, {
      expiresIn: process.env.APP_REFRESH_TOKEN_EXPIRES_IN,
    });

    return { access_token, refresh_token };
  }

  async hashPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
