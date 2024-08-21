-- DropForeignKey
ALTER TABLE `CompteClients` DROP FOREIGN KEY `CompteClients_type_compte_id_fkey`;

-- DropForeignKey
ALTER TABLE `DossiersToTypesDocuments` DROP FOREIGN KEY `DossiersToTypesDocuments_dossiersId_fkey`;

-- DropForeignKey
ALTER TABLE `DossiersToTypesDocuments` DROP FOREIGN KEY `DossiersToTypesDocuments_typesdocumentsId_fkey`;

-- DropForeignKey
ALTER TABLE `TypesDocuments` DROP FOREIGN KEY `TypesDocuments_compte_id_fkey`;

-- AddForeignKey
ALTER TABLE `CompteClients` ADD CONSTRAINT `CompteClients_type_compte_id_fkey` FOREIGN KEY (`type_compte_id`) REFERENCES `TypeCompte`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DossiersToTypesDocuments` ADD CONSTRAINT `DossiersToTypesDocuments_typesdocumentsId_fkey` FOREIGN KEY (`typesdocumentsId`) REFERENCES `TypesDocuments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DossiersToTypesDocuments` ADD CONSTRAINT `DossiersToTypesDocuments_dossiersId_fkey` FOREIGN KEY (`dossiersId`) REFERENCES `Dossiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TypesDocuments` ADD CONSTRAINT `TypesDocuments_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `CompteClients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
