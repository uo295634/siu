-- --------------------------------------------------------
-- Estructura de la tabla `registro`
-- --------------------------------------------------------

DROP TABLE IF EXISTS registro;
CREATE TABLE registro (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    nivel DECIMAL(3,1) NOT NULL,
    tiempo DECIMAL(10,3) NOT NULL,
    PRIMARY KEY (id)
)