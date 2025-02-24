/*
  Warnings:

  - You are about to alter the column `sede` on the `alumno` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(45)`.
  - You are about to alter the column `fecha_pago` on the `pago` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `alumno` MODIFY `sede` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `pago` MODIFY `fecha_pago` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
