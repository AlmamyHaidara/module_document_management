/*
  Warnings:

  - You are about to drop the column `type_compte` on the `CompteClients` table. All the data in the column will be lost.
  - Added the required column `type_compte_id` to the `CompteClients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CompteClients` DROP COLUMN `type_compte`,
    ADD COLUMN `type_compte_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `TypeCompte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `TypeCompte_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompteClients` ADD CONSTRAINT `CompteClients_type_compte_id_fkey` FOREIGN KEY (`type_compte_id`) REFERENCES `TypeCompte`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
