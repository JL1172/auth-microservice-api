/*
  Warnings:

  - Changed the type of `expiration_time` on the `BlacklistJwt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BlacklistJwt" DROP COLUMN "expiration_time",
ADD COLUMN     "expiration_time" TIMESTAMP(3) NOT NULL;
