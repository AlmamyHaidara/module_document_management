/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Clients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Clients` ADD COLUMN `email` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Clients_email_key` ON `Clients`(`email`);
