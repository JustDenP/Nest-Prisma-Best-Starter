-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;
