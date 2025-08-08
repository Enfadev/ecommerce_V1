-- CreateTable
CREATE TABLE `ContactPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NOT NULL,
    `heroDescription` VARCHAR(191) NOT NULL,
    `contactMethods` JSON NOT NULL,
    `officeLocations` JSON NOT NULL,
    `businessHours` JSON NOT NULL,
    `socialMedia` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
