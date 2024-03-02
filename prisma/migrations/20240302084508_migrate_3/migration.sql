/*
  Warnings:

  - Added the required column `created_at` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_at` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `created_at` VARCHAR(255) NOT NULL,
    ADD COLUMN `due_date` VARCHAR(255) NOT NULL,
    ADD COLUMN `update_at` VARCHAR(255) NOT NULL,
    MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `description` VARCHAR(255) NOT NULL;
