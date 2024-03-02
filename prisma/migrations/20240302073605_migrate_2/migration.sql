/*
  Warnings:

  - You are about to drop the column `due_date` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `due_date`,
    MODIFY `user_id` VARCHAR(191) NOT NULL;
