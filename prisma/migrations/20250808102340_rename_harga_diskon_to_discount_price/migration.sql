/*
  Warnings:

  - You are about to drop the column `hargaDiskon` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `hargaDiskon`,
    ADD COLUMN `discountPrice` DOUBLE NULL;
