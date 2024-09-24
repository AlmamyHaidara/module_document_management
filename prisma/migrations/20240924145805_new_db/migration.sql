/*
  Warnings:

  - You are about to drop the column `typeComptId` on the `Piece` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Piece` DROP FOREIGN KEY `Piece_typeComptId_fkey`;

-- AlterTable
ALTER TABLE `CompteClients` ADD COLUMN `annee` VARCHAR(191) NULL,
    MODIFY `numero_compte` VARCHAR(100) NOT NULL,
    MODIFY `client_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Piece` DROP COLUMN `typeComptId`,
    ADD COLUMN `dossierId` INTEGER NULL;

-- CreateTable
CREATE TABLE `PieceName` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `typeComptId` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PieceName_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PieceName` ADD CONSTRAINT `PieceName_typeComptId_fkey` FOREIGN KEY (`typeComptId`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Piece` ADD CONSTRAINT `Piece_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
