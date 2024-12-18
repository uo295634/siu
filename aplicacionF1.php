<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>F1 Desktop - Aplicacion F1</title>
    <link rel="icon" href="multimedia/imagenes/icon.ico" type="image/x-icon">
    <meta name="author" content="Miguel" />
    <meta name="description" content="Página que contiene una aplicacion que opera con bases de datos" />
    <meta name="keywords" content="BD, aplicacion" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
</head>
<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
        <nav>
            <a href="index.html">Inicio</a>
            <a href="piloto.html">Piloto</a>
            <a href="noticias.html">Noticias</a>
            <a href="calendario.html">Calendario</a>
            <a href="meteorologia.html">Meteorología</a>
            <a href="circuito.html">Circuito</a>
            <a href="viajes.php">Viajes</a>
            <a href="juegos.html">Juegos</a>
        </nav>
    </header>
    <p class="migas">Estás en: <a href="index.html">Inicio</a> >> AplicacionF1</p>

    <section>
        <h2>Gestión de la base de datos de F1</h2>
        <form method="post" action="">
            <button type="submit" name="accion" value="crear_bd">Crear Base de Datos</button>
            <button type="submit" name="accion" value="importar">Importar Datos</button>
            <button type="submit" name="accion" value="exportar">Exportar Datos</button>
        </form>
    </section>

    <?php
    class Formula1App {
        private $host = "localhost";
        private $user = "DBUSER2024";
        private $password = "DBPSWD2024";
        private $database = "formula1";
        private $conn;

        public function __construct() {
            $this->connect();
        }

        private function connect() {
            $this->conn = new mysqli($this->host, $this->user, $this->password, $this->database);
            if ($this->conn->connect_error) {
                die("Error de conexión: " . $this->conn->connect_error);
            }
        }

        public function crearBaseDeDatos() {
            $sql_create_db = "CREATE DATABASE IF NOT EXISTS {$this->database}";
            if ($this->conn->query($sql_create_db)) {
                echo "Base de datos creada correctamente.<br>";
            } else {
                die("Error creando la base de datos: " . $this->conn->error);
            }

            $this->conn->select_db($this->database);

            $sql_create_tables = "
            CREATE TABLE IF NOT EXISTS Equipos (
                id_equipo INT AUTO_INCREMENT PRIMARY KEY,
                nombre_equipo VARCHAR(255) NOT NULL,
                fundacion YEAR NOT NULL,
                pais VARCHAR(100)
            );

            CREATE TABLE IF NOT EXISTS Conductores (
                id_conductor INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                nacionalidad VARCHAR(100),
                edad TINYINT,
                equipo_id INT,
                FOREIGN KEY (equipo_id) REFERENCES Equipos(id_equipo)
            );

            CREATE TABLE IF NOT EXISTS Circuitos (
                id_circuito INT AUTO_INCREMENT PRIMARY KEY,
                nombre_circuito VARCHAR(255) NOT NULL,
                ubicacion VARCHAR(255),
                longitud FLOAT
            );

            CREATE TABLE IF NOT EXISTS Carreras (
                id_carrera INT AUTO_INCREMENT PRIMARY KEY,
                fecha DATE NOT NULL,
                circuito_id INT,
                FOREIGN KEY (circuito_id) REFERENCES Circuitos(id_circuito)
            );

            CREATE TABLE IF NOT EXISTS Resultados (
                id_resultado INT AUTO_INCREMENT PRIMARY KEY,
                id_carrera INT,
                id_conductor INT,
                posicion TINYINT NOT NULL,
                puntos TINYINT NOT NULL,
                FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera),
                FOREIGN KEY (id_conductor) REFERENCES Conductores(id_conductor)
            );";

            if ($this->conn->multi_query($sql_create_tables)) {
                echo "Tablas creadas correctamente.<br>";
            } else {
                die("Error creando las tablas: " . $this->conn->error);
            }
            $this->conn->close();
        }

        public function importarCSV($archivo, $tabla) {
            $this->connect();
            $this->conn->select_db($this->database);

            // Limpiar la tabla antes de insertar nuevos datos
            if ($tabla == 'Equipos') {
                $this->conn->query("SET foreign_key_checks = 0"); // Deshabilitar claves foráneas
                $this->conn->query("TRUNCATE TABLE Equipos"); // Limpiar la tabla
                $this->conn->query("SET foreign_key_checks = 1"); // Habilitar claves foráneas
            }

            if (($handle = fopen($archivo, "r")) !== FALSE) {
                fgetcsv($handle);
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    if ($tabla == 'Equipos') {
                        $nombre = $data[0];
                        $fundacion = $data[1];
                        $pais = $data[2];
                        $sql = "INSERT INTO Equipos (nombre_equipo, fundacion, pais) VALUES ('$nombre', '$fundacion', '$pais')";
                    }
                    $this->conn->query($sql);
                }
                fclose($handle);
                echo "Datos importados correctamente en la tabla {$tabla}.<br>";
            } else {
                echo "Error abriendo el archivo CSV.<br>";
            }
            $this->conn->close();
        }

        public function exportarCSV($tabla, $archivo_salida) {
            $this->connect();
            $this->conn->select_db($this->database);

            $sql = "SELECT * FROM {$tabla}";
            $result = $this->conn->query($sql);

            if ($result->num_rows > 0) {
                $output = fopen($archivo_salida, "w");
                $columnas = $result->fetch_fields();
                $encabezado = [];
                foreach ($columnas as $columna) {
                    $encabezado[] = $columna->name;
                }
                fputcsv($output, $encabezado);

                while ($row = $result->fetch_assoc()) {
                    fputcsv($output, $row);
                }
                fclose($output);
                echo "Datos exportados correctamente a {$archivo_salida}.<br>";
            } else {
                echo "No hay datos en la tabla {$tabla}.<br>";
            }
            $this->conn->close();
        }
    }

    $app = new Formula1App();

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
        $accion = $_POST['accion'];

        switch ($accion) {
            case 'crear_bd':
                $app->crearBaseDeDatos();
                break;
            case 'importar':
                $archivo = "datos_equipos.csv";
                $app->importarCSV($archivo, 'Equipos');
                break;
            case 'exportar':
                $archivo_salida = "equipos_exportados.csv";
                $app->exportarCSV('Equipos', $archivo_salida);
                break;
            default:
                echo "Acción no válida.";
        }
    }
    ?>
</body>
</html>
