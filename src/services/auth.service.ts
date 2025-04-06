import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/middleware/prisma";


@Injectable()
export class AuthService {
    constructor(
        private readonly db: PrismaService,
        private readonly jwtService: JwtService,
      ) {}


      async createUser(firstName: string, lastName: string, email: string, password: string) {
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
}