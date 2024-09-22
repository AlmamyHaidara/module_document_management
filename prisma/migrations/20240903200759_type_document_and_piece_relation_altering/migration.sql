/*
  Warnings:

  - You are about to drop the column `dossierId` on the `Piece` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Piece` DROP FOREIGN KEY `Piece_dossierId_fkey`;

-- AlterTable
ALTER TABLE `Piece` DROP COLUMN `dossierId`,
    ADD COLUMN `typeComptId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Piece` ADD CONSTRAINT `Piece_typeComptId_fkey` FOREIGN KEY (`typeComptId`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
