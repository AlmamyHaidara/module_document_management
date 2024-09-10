-- DropForeignKey
ALTER TABLE `Piece` DROP FOREIGN KEY `Piece_dossierId_fkey`;

-- AddForeignKey
ALTER TABLE `Piece` ADD CONSTRAINT `Piece_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
