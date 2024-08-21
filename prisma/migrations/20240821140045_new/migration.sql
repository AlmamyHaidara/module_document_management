-- DropForeignKey
ALTER TABLE `MetaDonnees` DROP FOREIGN KEY `MetaDonnees_typesDocID_fkey`;

-- AddForeignKey
ALTER TABLE `MetaDonnees` ADD CONSTRAINT `MetaDonnees_typesDocID_fkey` FOREIGN KEY (`typesDocID`) REFERENCES `TypesDocuments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
