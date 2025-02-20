/*
  Warnings:

  - You are about to alter the column `fecha_nacimiento` on the `alumno` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Date`.
  - You are about to alter the column `fecha_pago` on the `pago` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `alumno` MODIFY `fecha_nacimiento` DATE NOT NULL;

-- AlterTable
ALTER TABLE `pago` MODIFY `fecha_pago` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
