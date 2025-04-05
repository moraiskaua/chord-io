/*
  Warnings:

  - The primary key for the `daily_chords` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "daily_chords" DROP CONSTRAINT "daily_chords_pkey",
ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'easy',
ADD CONSTRAINT "daily_chords_pkey" PRIMARY KEY ("userId", "date", "difficulty");
