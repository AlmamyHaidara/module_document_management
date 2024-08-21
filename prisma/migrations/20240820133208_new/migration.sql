/*
  Warnings:

  - You are about to drop the column `email` on the `Clients` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Clients_email_key` ON `Clients`;

-- AlterTable
ALTER TABLE `Clients` DROP COLUMN `email`;
