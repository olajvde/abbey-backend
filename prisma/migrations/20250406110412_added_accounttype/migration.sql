/*
  Warnings:

  - Added the required column `accountType` to the `Accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('savings', 'current', 'corporate');

-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "accountType" "accountType" NOT NULL;
