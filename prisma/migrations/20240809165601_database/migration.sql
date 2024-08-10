-- CreateTable
CREATE TABLE `Clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `adresse` VARCHAR(255) NULL,
    `telephone` VARCHAR(20) NULL,
    `profession` VARCHAR(255) NULL,
    `nature` ENUM('Physique', 'Morale') NOT NULL,

    INDEX `Clients_nom_adresse_nature_idx`(`nom`, `adresse`, `nature`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompteClients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `matricule` VARCHAR(255) NULL,
    `numero_compte` VARCHAR(255) NULL,
    `type_compte` VARCHAR(255) NULL,
    `date_ouverture` DATETIME(3) NULL,
    `agence` VARCHAR(255) NULL,
    `code_gestionnaire` VARCHAR(255) NULL,

    INDEX `CompteClients_matricule_type_compte_code_gestionnaire_agence_idx`(`matricule`, `type_compte`, `code_gestionnaire`, `agence`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypesDocuments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NULL,
    `nom_type` VARCHAR(255) NOT NULL,
    `compte_client_id` INTEGER NOT NULL,

    UNIQUE INDEX `TypesDocuments_code_key`(`code`),
    INDEX `TypesDocuments_nom_type_idx`(`nom_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dossiers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,
    `type_document_id` INTEGER NOT NULL,

    UNIQUE INDEX `Dossiers_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MetaDonnees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dossier_id` INTEGER NOT NULL,
    `cle` VARCHAR(255) NOT NULL,
    `valeur` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Piece` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NULL,
    `nom` VARCHAR(50) NULL,
    `dossier_id` INTEGER NOT NULL,
    `date_creation` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompteClients` ADD CONSTRAINT `CompteClients_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TypesDocuments` ADD CONSTRAINT `TypesDocuments_compte_client_id_fkey` FOREIGN KEY (`compte_client_id`) REFERENCES `CompteClients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossiers` ADD CONSTRAINT `Dossiers_type_document_id_fkey` FOREIGN KEY (`type_document_id`) REFERENCES `TypesDocuments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MetaDonnees` ADD CONSTRAINT `MetaDonnees_dossier_id_fkey` FOREIGN KEY (`dossier_id`) REFERENCES `Dossiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Piece` ADD CONSTRAINT `Piece_dossier_id_fkey` FOREIGN KEY (`dossier_id`) REFERENCES `Dossiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
