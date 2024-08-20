/*
  Warnings:

  - You are about to drop the column `type_document_id` on the `CompteClients` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CompteClients` DROP FOREIGN KEY `CompteClients_type_document_id_fkey`;

-- AlterTable
ALTER TABLE `CompteClients` DROP COLUMN `type_document_id`;

-- AlterTable
ALTER TABLE `TypesDocuments` ADD COLUMN `compte_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TypesDocuments` ADD CONSTRAINT `TypesDocuments_compte_id_fkey` FOREIGN KEY (`compte_id`) REFERENCES `CompteClients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
