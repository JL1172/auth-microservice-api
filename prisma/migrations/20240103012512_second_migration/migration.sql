/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BlacklistJwt" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expiration_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlacklistJwt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistJwt_token_key" ON "BlacklistJwt"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
