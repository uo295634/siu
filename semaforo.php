<!DOCTYPE HTML>
<html lang="es">
<head>
     <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1 Desktop - Juego del Semáforo</title>
    <link rel="icon" href="multimedia/imagenes/icon.ico" type="image/x-icon">
    <meta name="author" content="Miguel" />
    <meta name="description" content="Página que contiene un juego de semaforo" />
    <meta name="keywords" content="juegos, reaccion, entretenimiento" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo.css" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
    <header>
        <h1><a href="index.html"> F1 Desktop </a></h1>
        <nav>
            <a href="index.html" title="enlace al inicio">Inicio</a>
            <a href="piloto.html" title="enlace a piloto">Piloto</a>
            <a href="noticias.html" title="enlace a noticias">Noticias</a>
            <a href="calendario.html" title="enlace a calendario">Calendario</a>
            <a href="meteorologia.html" title="enlace a meteorologia">Metereología</a>
            <a href="circuito.html" title="enlace a circuito">Circuito</a>
            <a href="viajes.php" title="enlace a viajes">Viajes</a>
            <a href="juegos.html" title="enlace a juegos">Juegos</a>
        </nav>
    </header>
    <?php
        class Record {
            private $server;
            private $user;
            private $pass;
            private $dbname;

            public function __construct() {
                $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->dbname = "records";

                // Conexión a la base de datos
                $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
                
                // Verificar conexión
                if ($this->conn->connect_error) {
                    die("Error de conexión: " . $this->conn->connect_error);
                }
            }

             // Método para insertar los datos del formulario en la tabla "registro"
            public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
                $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
                if (!$stmt) {
                    die("Error al preparar la consulta: " . $this->conn->error);
                }

                // Vincular los parámetros y ejecutar la consulta
                $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);
                if ($stmt->execute()) {
                    echo "¡Récord guardado exitosamente!";
                } else {
                    echo "Error al guardar el récord: " . $stmt->error;
                }

                $stmt->close();
            }

            // Método para obtener los 10 mejores récords para un nivel
            public function getTopRecords($nivel) {
                $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
                if (!$stmt) {
                    die("Error al preparar la consulta: " . $this->conn->error);
                }

                $stmt->bind_param("d", $nivel);
                $stmt->execute();
                $result = $stmt->get_result();

                $records = [];
                while ($row = $result->fetch_assoc()) {
                    $records[] = $row;
                }

                $stmt->close();
                return $records;
            }
        }

        // Procesar los datos enviados por el formulario
        if (count($_POST)>0) {
            // Obtener datos del formulario
            $nombre = htmlspecialchars($_POST['name']);
            $apellidos = htmlspecialchars($_POST['surname']);
            $nivel = floatval($_POST['difficulty']);
            $tiempo = floatval($_POST['reactionTime']);

            // Crear una instancia de la clase Record y guardar los datos
            $record = new Record();
            $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

            // Obtener los 10 mejores récords para el nivel actual
            $topRecords = $record->getTopRecords($nivel);

            // Generar la lista HTML
            echo "<h3>Top 10 Récords para el nivel $nivel</h3>";
            echo "<ol>";
            foreach ($topRecords as $rec) {
                echo "<li>{$rec['nombre']} {$rec['apellidos']} - {$rec['tiempo']} segundos</li>";
            }
            echo "</ol>";
        }
    ?>

    <main>
        <!-- Encabezado del juego -->
        <h2>Semáforo</h2>

        <!-- Luces del semáforo -->
        <div></div>
        <div></div>
        <div></div>
        <div></div>

        <!-- Botones de control -->
         <button onclick="semaforo.initSequence()">Arranque</button>
         <button onclick="semaforo.stopReaction()" disabled>Reacción</button>
    </main>

    <script src="js/semaforo.js"></script>
</body>
</html>
