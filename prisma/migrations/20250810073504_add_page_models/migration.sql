-- CreateTable
CREATE TABLE `HomePage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroSlides` JSON NOT NULL,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NOT NULL,
    `heroDescription` VARCHAR(191) NOT NULL,
    `features` JSON NOT NULL,
    `statsData` JSON NOT NULL,
    `aboutPreview` JSON NOT NULL,
    `testimonialsData` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AboutPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NOT NULL,
    `heroDescription` VARCHAR(191) NOT NULL,
    `companyStory` TEXT NOT NULL,
    `mission` TEXT NOT NULL,
    `vision` TEXT NOT NULL,
    `values` JSON NOT NULL,
    `statistics` JSON NOT NULL,
    `features` JSON NOT NULL,
    `teamMembers` JSON NOT NULL,
    `timeline` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NOT NULL,
    `heroDescription` VARCHAR(191) NOT NULL,
    `activeEvents` JSON NOT NULL,
    `upcomingEvents` JSON NOT NULL,
    `pastEvents` JSON NOT NULL,
    `eventCategories` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heroTitle` VARCHAR(191) NOT NULL,
    `heroSubtitle` VARCHAR(191) NOT NULL,
    `heroDescription` VARCHAR(191) NOT NULL,
    `featuredCategories` JSON NOT NULL,
    `promotionalBanner` JSON NOT NULL,
    `filterOptions` JSON NOT NULL,
    `sortOptions` JSON NOT NULL,
    `seoContent` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
