-- DropForeignKey
ALTER TABLE `DossierInfo` DROP FOREIGN KEY `DossierInfo_dossierId_fkey`;

-- AlterTable
ALTER TABLE `DossierInfo` MODIFY `dossierId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `DossierInfo` ADD CONSTRAINT `DossierInfo_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossiers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
