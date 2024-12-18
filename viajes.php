<?php
// Crear una instancia del carrusel para un país
$carrusel = new Carrusel('Canberra', 'Australia');
$carrusel->obtenerFotos();
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>F1 Desktop - Viajes</title>
    <link rel="icon" href="multimedia/imagenes/icon.ico" type="image/x-icon">
    <meta name="author" content="Miguel" />
    <meta name="description" content="Página que contiene la información de los viajes disponibles" />
    <meta name="keywords" content="viajes, desplazamientos" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <script src="js/viajes.js" defer></script>
    <!-- Cargar el script de Google Maps -->
    <script 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU">
    </script>
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
    <p class="migas">Estás en: <a href="index.html">Inicio</a> >> Viajes</p>
<?php
    class Carrusel {
        private $capital;
        private $pais;
        private $fotos;

        // Constructor que recibe la capital y el país
        public function __construct($capital, $pais) {
            $this->capital = $capital;
            $this->pais = $pais;
            $this->fotos = [];
        }

        // Método para obtener fotos desde Flickr
        public function obtenerFotos() {
            $apiKey = '0565634739c78dcdbf56368cb0991f0b';
            $endpoint = "https://www.flickr.com/services/rest/";
            $params = [
                'method' => 'flickr.photos.search',
                'api_key' => $apiKey,
                'format' => 'json',
                'nojsoncallback' => 1,
                'text' => $this->pais,
                'per_page' => 10,
                'page' => 1,
            ];

            $url = $endpoint . '?' . http_build_query($params);
            $response = file_get_contents($url);
            $data = json_decode($response, true);

            if (isset($data['photos']['photo'])) {
                foreach ($data['photos']['photo'] as $photo) {
                    $this->fotos[] = "https://live.staticflickr.com/{$photo['server']}/{$photo['id']}_{$photo['secret']}_q.jpg";
                }
            }
        }

        // Método para renderizar las fotos como un carrusel en HTML
        public function renderizarCarrusel() {
            echo '<section>';
            echo '<button onclick="moverCarrusel(-1)"><</button>';
            echo '<figure>';
            foreach ($this->fotos as $foto) {
                echo "<img src=\"$foto\" alt=\"Foto del país\" loading=\"lazy\" />";
            }
            echo '</figure>';
            echo '<button onclick="moverCarrusel(1)">></button>';
            echo '</section>';
        }
    }
    class Moneda {
        private $monedaLocal;
        private $monedaComparacion;
    
        public function __construct($monedaLocal, $monedaComparacion) {
            $this->monedaLocal = $monedaLocal;
            $this->monedaComparacion = $monedaComparacion;
        }
    
        public function obtenerCambio() {
            $apiUrl = "https://api.exchangerate-api.com/v4/latest/{$this->monedaComparacion}";
            $response = file_get_contents($apiUrl);
            $data = json_decode($response, true);
    
            if (isset($data['rates'][$this->monedaLocal])) {
                return $data['rates'][$this->monedaLocal];
            } else {
                throw new Exception("No se pudo obtener el tipo de cambio para {$this->monedaLocal}.");
            }
        }
    }
?>
    <script>
        let indiceActual = 0;

        function moverCarrusel(direccion) {
            // Seleccionar el carrusel sin usar id o clase
            const carrusel = document.querySelector("section figure");
            const imagenes = carrusel.querySelectorAll("img");

            // Calcular el nuevo índice
            indiceActual += direccion;

            // Asegurar el desplazamiento cíclico
            if (indiceActual < 0) {
                indiceActual = imagenes.length - 1;
            } else if (indiceActual >= imagenes.length) {
                indiceActual = 0;
            }

            // Aplicar el desplazamiento usando transform
            const desplazamiento = -indiceActual * 100; // Desplazamiento del 100% por imagen
            imagenes.forEach((img) => {
                img.style.transform = `translateX(${desplazamiento}%)`;
            });
        }
    </script>
    <h2>Información acerca de los viajes disponibles</h2>
    

    <section>
        <?php
        try {
            $moneda = new Moneda('AUD', 'EUR');
            $cambio = $moneda->obtenerCambio();
            echo "<p>El tipo de cambio actual es 1€ = " . number_format($cambio, 2) . " AUD</p>";
        } catch (Exception $e) {
            echo "<p>Error: " . $e->getMessage() . "</p>";
        }
        ?>
    </section>

    <section>
        <?php $carrusel->renderizarCarrusel(); ?>
    </section>

    <section>
        <!--mapa dinámico -->
        <div style="width: 80%; height: 300px;"></div>
    </section>
    
</body>
</html>
