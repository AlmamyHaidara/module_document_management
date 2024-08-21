/*
  Warnings:

  - You are about to drop the column `dossier_info_id` on the `Dossiers` table. All the data in the column will be lost.
  - You are about to drop the column `piece_id` on the `Dossiers` table. All the data in the column will be lost.
  - Added the required column `dossierId` to the `DossierInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Dossiers` DROP FOREIGN KEY `Dossiers_dossier_info_id_fkey`;

-- DropForeignKey
ALTER TABLE `Dossiers` DROP FOREIGN KEY `Dossiers_piece_id_fkey`;

-- AlterTable
ALTER TABLE `DossierInfo` ADD COLUMN `dossierId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Dossiers` DROP COLUMN `dossier_info_id`,
    DROP COLUMN `piece_id`;

-- AlterTable
ALTER TABLE `Piece` ADD COLUMN `dossierId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `DossierInfo` ADD CONSTRAINT `DossierInfo_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Piece` ADD CONSTRAINT `Piece_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossiers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
