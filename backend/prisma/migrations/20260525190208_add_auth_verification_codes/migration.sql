-- CreateEnum
CREATE TYPE "VerificationCodePurpose" AS ENUM ('LOGIN', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "auth_verification_codes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "purpose" "VerificationCodePurpose" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_verification_codes_userId_idx" ON "auth_verification_codes"("userId");

-- CreateIndex
CREATE INDEX "auth_verification_codes_email_idx" ON "auth_verification_codes"("email");

-- CreateIndex
CREATE INDEX "auth_verification_codes_purpose_idx" ON "auth_verification_codes"("purpose");

-- AddForeignKey
ALTER TABLE "auth_verification_codes" ADD CONSTRAINT "auth_verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
