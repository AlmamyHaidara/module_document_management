-- AlterTable
ALTER TABLE `MetaDonnees` ADD COLUMN `content` TEXT NULL,
    MODIFY `valeur` VARCHAR(200) NOT NULL;
