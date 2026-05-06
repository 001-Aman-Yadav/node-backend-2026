-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpGeneratedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_half" INTEGER NOT NULL,
    "price_ful" INTEGER NOT NULL,
    "thumbnali" TEXT NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_name_key" ON "Menu"("name");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
