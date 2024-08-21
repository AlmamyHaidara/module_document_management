/*
  Warnings:

  - You are about to drop the column `type_document_id` on the `Dossiers` table. All the data in the column will be lost.
  - Made the column `date_creation` on table `Piece` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Dossiers` DROP FOREIGN KEY `Dossiers_type_document_id_fkey`;

-- DropIndex
DROP INDEX `Dossiers_type_document_id_piece_id_idx` ON `Dossiers`;

-- AlterTable
ALTER TABLE `Dossiers` DROP COLUMN `type_document_id`;

-- AlterTable
ALTER TABLE `Piece` MODIFY `path` VARCHAR(255) NOT NULL,
    MODIFY `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `DossiersToTypesDocuments` (
    `dossiersId` INTEGER NOT NULL,
    `typesdocumentsId` INTEGER NOT NULL,

    INDEX `DossiersToTypesDocuments_dossiersId_idx`(`dossiersId`),
    INDEX `DossiersToTypesDocuments_typesdocumentsId_idx`(`typesdocumentsId`),
    PRIMARY KEY (`dossiersId`, `typesdocumentsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Dossiers_code_nom_idx` ON `Dossiers`(`code`, `nom`);
