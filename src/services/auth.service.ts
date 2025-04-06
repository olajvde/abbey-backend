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
    return this.db.users.findUnique({
      where: { email },
    });
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
