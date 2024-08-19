-- CreateTable
CREATE TABLE `Clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(20) NOT NULL,
    `profession` VARCHAR(100) NOT NULL,
    `nature` ENUM('Physique', 'Morale') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Clients_nom_prenom_idx`(`nom`, `prenom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompteClients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricule` VARCHAR(50) NOT NULL,
    `numero_compte` VARCHAR(20) NOT NULL,
    `type_compte` VARCHAR(50) NOT NULL,
    `date_ouverture` DATETIME(3) NOT NULL,
    `agence` VARCHAR(100) NOT NULL,
    `code_gestionnaire` VARCHAR(20) NOT NULL,
    `client_id` INTEGER NOT NULL,
    `type_document_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CompteClients_matricule_key`(`matricule`),
    UNIQUE INDEX `CompteClients_numero_compte_key`(`numero_compte`),
    INDEX `CompteClients_client_id_numero_compte_idx`(`client_id`, `numero_compte`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypesDocuments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `nom_type` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TypesDocuments_code_key`(`code`),
    INDEX `TypesDocuments_code_nom_type_idx`(`code`, `nom_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DossierInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cle` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dossiers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `type_document_id` INTEGER NOT NULL,
    `piece_id` INTEGER NOT NULL,
    `dossier_info_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dossiers_code_key`(`code`),
    INDEX `Dossiers_type_document_id_piece_id_idx`(`type_document_id`, `piece_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Piece` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `nom` VARCHAR(100) NULL,
    `path` VARCHAR(254) NOT NULL,
    `date_creation` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Piece_code_key`(`code`),
    INDEX `Piece_code_idx`(`code`),
    INDEX `Piece_date_creation_idx`(`date_creation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetaDonnees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cle` VARCHAR(50) NOT NULL,
    `valeur` TEXT NOT NULL,
    `typesDocID` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `MetaDonnees_cle_idx`(`cle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DossiersToTypesDocuments` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DossiersToTypesDocuments_AB_unique`(`A`, `B`),
    INDEX `_DossiersToTypesDocuments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompteClients` ADD CONSTRAINT `CompteClients_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Clients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompteClients` ADD CONSTRAINT `CompteClients_type_document_id_fkey` FOREIGN KEY (`type_document_id`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossiers` ADD CONSTRAINT `Dossiers_type_document_id_fkey` FOREIGN KEY (`type_document_id`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossiers` ADD CONSTRAINT `Dossiers_piece_id_fkey` FOREIGN KEY (`piece_id`) REFERENCES `Piece`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossiers` ADD CONSTRAINT `Dossiers_dossier_info_id_fkey` FOREIGN KEY (`dossier_info_id`) REFERENCES `DossierInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaDonnees` ADD CONSTRAINT `MetaDonnees_typesDocID_fkey` FOREIGN KEY (`typesDocID`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DossiersToTypesDocuments` ADD CONSTRAINT `_DossiersToTypesDocuments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dossiers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DossiersToTypesDocuments` ADD CONSTRAINT `_DossiersToTypesDocuments_B_fkey` FOREIGN KEY (`B`) REFERENCES `TypesDocuments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
