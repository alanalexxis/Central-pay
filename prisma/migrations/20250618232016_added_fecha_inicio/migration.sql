/*
  Warnings:

  - You are about to alter the column `fecha_pago` on the `pago` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(45)`.

*/
-- AlterTable
ALTER TABLE `pago` ADD COLUMN `fecha_inicio` VARCHAR(45) NULL,
    MODIFY `fecha_pago` VARCHAR(45) NOT NULL;
