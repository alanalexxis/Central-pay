-- CreateTable
CREATE TABLE `alumno` (
    `idalumno` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(200) NOT NULL,
    `telefono` VARCHAR(45) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,

    PRIMARY KEY (`idalumno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pago` (
    `idpago` INTEGER NOT NULL AUTO_INCREMENT,
    `idalumno` INTEGER NOT NULL,
    `fecha_pago` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nota_venta` VARCHAR(45) NOT NULL,

    INDEX `fk_pago_alumno_idx`(`idalumno`),
    PRIMARY KEY (`idpago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `idusuario` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(200) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `usuario_correo_key`(`correo`),
    PRIMARY KEY (`idusuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pago` ADD CONSTRAINT `fk_pago_alumno` FOREIGN KEY (`idalumno`) REFERENCES `alumno`(`idalumno`) ON DELETE NO ACTION ON UPDATE NO ACTION;
