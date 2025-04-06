-- CreateTable
CREATE TABLE "UserTokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdat" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "log_date" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'UTC'::text),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTokens_id_key" ON "UserTokens"("id");
