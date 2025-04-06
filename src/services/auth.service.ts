import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/middleware/prisma';
import * as bcrypt from 'bcrypt';

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
  ) {
    // const user = await this.db.user.create({
    //   data: {
    //     firstName,
    //     lastName,
    //     email,
    //     password,
    //   },
    // });
    // return user;
  }

  async hashPassword(
    password: string,
    saltRounds: number = 10,
  ): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
}
