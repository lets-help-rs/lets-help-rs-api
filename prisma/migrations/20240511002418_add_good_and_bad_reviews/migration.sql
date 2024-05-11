/*
  Warnings:

  - You are about to drop the column `reviews` on the `collect_points` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "collect_points" DROP COLUMN "reviews",
ADD COLUMN     "bad_reviews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "good_reviews" INTEGER NOT NULL DEFAULT 0;
