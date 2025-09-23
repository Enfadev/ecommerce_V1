-- AlterTable
ALTER TABLE `aboutpage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `contactpage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `homepage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaDescription` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `seoExtras` JSON NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `metaKeywords` VARCHAR(191) NULL,
    ADD COLUMN `noindex` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ogDescription` VARCHAR(191) NULL,
    ADD COLUMN `ogImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `structuredData` JSON NULL;

-- AlterTable
ALTER TABLE `productpage` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
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
