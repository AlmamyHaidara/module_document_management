/*
  Warnings:

  - You are about to alter the column `code` on the `Clients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `Clients` MODIFY `code` VARCHAR(50) NOT NULL;
