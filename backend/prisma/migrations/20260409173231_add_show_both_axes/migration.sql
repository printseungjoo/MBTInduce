-- AlterTable
ALTER TABLE "public"."MbtiPreference" ADD COLUMN     "showBothAxes" TEXT[] DEFAULT ARRAY[]::TEXT[];
