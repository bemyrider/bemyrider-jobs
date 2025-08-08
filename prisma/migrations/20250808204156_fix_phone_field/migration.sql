/*
  Warnings:

  - Added the required column `phone` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."applications" ADD COLUMN     "phone" TEXT NOT NULL;
