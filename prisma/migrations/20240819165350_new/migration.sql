/*
  Warnings:

  - You are about to alter the column `cle` on the `DossierInfo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `nom` on the `Dossiers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `_DossiersToTypesDocuments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_DossiersToTypesDocuments` DROP FOREIGN KEY `_DossiersToTypesDocuments_A_fkey`;

-- DropForeignKey
ALTER TABLE `_DossiersToTypesDocuments` DROP FOREIGN KEY `_DossiersToTypesDocuments_B_fkey`;

-- AlterTable
ALTER TABLE `DossierInfo` MODIFY `cle` VARCHAR(100) NOT NULL,
    MODIFY `value` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Dossiers` MODIFY `nom` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `_DossiersToTypesDocuments`;
