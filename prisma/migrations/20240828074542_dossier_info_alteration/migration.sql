-- DropForeignKey
ALTER TABLE `DossiersToTypesDocuments` DROP FOREIGN KEY `DossiersToTypesDocuments_dossiersId_fkey`;

-- AddForeignKey
ALTER TABLE `DossiersToTypesDocuments` ADD CONSTRAINT `DossiersToTypesDocuments_dossiersId_fkey` FOREIGN KEY (`dossiersId`) REFERENCES `Dossiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
