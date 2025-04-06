import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/middleware/prisma';

@Injectable()
export class AccountsService {
  constructor(private readonly db: PrismaService) {}

  async createAccount(customerId: string, officerId: string) {
    const customer = await this.db.users.findUnique({
      where: { id: customerId },
    });
    const officer = await this.db.users.findUnique({
      where: { id: officerId },
    });

    if (!customer || !officer) {
      throw new Error('Customer or Account Officer not found');
    }

    // Get the latest account
    const lastAccount = await this.db.accounts.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    // Calculate next account number
    let nextNumber: string;
    if (!lastAccount) {
      nextNumber = '0020000001';
    } else {
      const lastNum = parseInt(lastAccount.accountNumber.slice(3)); // remove '002'
      const incremented = (lastNum + 1).toString().padStart(7, '0');
      nextNumber = `002${incremented}`;
    }

    return this.db.accounts.create({
      data: {
        accountNumber: nextNumber,
        customerId,
        officerId,
        customerName: `${customer.firstName} ${customer.lastName}`,
        officerName: `${officer.firstName} ${officer.lastName}`,
        balance: 0.0,
      },
    });
  }
}
