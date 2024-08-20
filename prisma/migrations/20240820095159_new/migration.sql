-- AddForeignKey
ALTER TABLE `DossiersToTypesDocuments` ADD CONSTRAINT `DossiersToTypesDocuments_typesdocumentsId_fkey` FOREIGN KEY (`typesdocumentsId`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DossiersToTypesDocuments` ADD CONSTRAINT `DossiersToTypesDocuments_dossiersId_fkey` FOREIGN KEY (`dossiersId`) REFERENCES `Dossiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
