-- CreateEnum
CREATE TYPE "Statuses" AS ENUM ('pending', 'active', 'suspended', 'deleted', 'banned', 'deactivated');

-- CreateEnum
CREATE TYPE "userType" AS ENUM ('customer', 'account_officer');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "userType" NOT NULL DEFAULT 'customer',
    "status" "Statuses" NOT NULL DEFAULT 'active',
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "officerName" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_accountNumber_key" ON "Accounts"("accountNumber");

-- AddForeignKey
ALTER TABLE "Accounts" ADD CONSTRAINT "Accounts_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
