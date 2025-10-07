-- AlterTable
ALTER TABLE `AboutPage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `ContactPage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `HomePage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `structuredData` JSON NULL;

-- AlterTable
ALTER TABLE `ProductPage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `system_settings` ADD COLUMN `canonicalBaseUrl` VARCHAR(191) NULL,
    ADD COLUMN `defaultMetaDescription` VARCHAR(191) NULL,
    ADD COLUMN `defaultMetaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `defaultMetaTitle` VARCHAR(191) NULL,
    ADD COLUMN `defaultOgImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `enableIndexing` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `facebookPage` VARCHAR(191) NULL,
    ADD COLUMN `robotsRules` JSON NULL,
    ADD COLUMN `twitterHandle` VARCHAR(191) NULL;
