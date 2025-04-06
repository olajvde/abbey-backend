/* eslint-disable prettier/prettier */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly maxRetries = 200;  // Maximum number of retries
  private readonly retryDelay = 5000; // Delay between retries in milliseconds (2 seconds)

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async connectWithRetry(retries = 0): Promise<void> {
    // eslint-disable-next-line prettier/prettier
    try {
      await this.$connect();
      console.log('====Database Connected=====');
    } catch (error) {
      if (retries < this.maxRetries) {
        console.warn(
          `Database connection failed. Retrying (${retries + 1}/${this.maxRetries})...`,
        );
        await this.delay(this.retryDelay);
        await this.connectWithRetry(retries + 1);
      } else {
        console.error('Failed to connect to the database after several retries:', error);
        throw new Error('Unable to connect to the database.');
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}