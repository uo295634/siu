// Función para procesar el archivo (XML o KML)
function procesarArchivo(files) {
    const archivo = files[0];

    // Referencias a los elementos HTML donde se mostrarán los detalles
    const nombreArchivo = document.getElementById("nombreArchivo");
    const tamañoArchivo = document.getElementById("tamañoArchivo");
    const tipoArchivo = document.getElementById("tipoArchivo");
    const ultimaModificacion = document.getElementById("ultimaModificacion");
    const errorLectura = document.getElementById("errorLectura");

    // Limpiar los mensajes de error
    errorLectura.innerText = "";

    // Mostrar los metadatos del archivo
    nombreArchivo.innerText = `Nombre del archivo: ${archivo.name}`;
    tamañoArchivo.innerText = `Tamaño del archivo: ${archivo.size} bytes`;
    tipoArchivo.innerText = `Tipo del archivo: ${archivo.type || "Desconocido"}`;
    ultimaModificacion.innerText = `Última modificación: ${archivo.lastModifiedDate ? archivo.lastModifiedDate.toLocaleString() : "No disponible"}`;

    // Comprobar si es un archivo XML o KML
    if (archivo.name.endsWith(".xml") || archivo.name.endsWith(".kml")) {
        const lector = new FileReader();
        
        lector.onload = function(evento) {
            const contenido = evento.target.result;
            
            if (archivo.name.endsWith(".xml")) {
                procesarXML(contenido);
            } else if (archivo.name.endsWith(".kml")) {
                procesarKML(contenido);
            }
        };

        lector.onerror = function() {
            alert("Error al leer el archivo.");
        };

        lector.readAsText(archivo);
    } else {
        alert("Por favor, sube un archivo XML o KML.");
    }
}

// Función para procesar el archivo XML y mostrar información
function procesarXML(contenidoXML) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(contenidoXML, "application/xml");
    
    // Verificar si el XML tiene errores
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        alert("Error al procesar el archivo XML.");
        return;
    }
    
    // Extraer y mostrar información del XML
    mostrarInformacionCircuito(xmlDoc);
}

// Función para procesar el archivo KML y extraer las coordenadas
function procesarKML(contenidoKML) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(contenidoKML, "text/xml");
    
    const coordenadas = xmlDoc.getElementsByTagName("coordinates");
    const puntos = [];

    for (let i = 0; i < coordenadas.length; i++) {
        const coords = coordenadas[i].textContent.trim().split(" ");
        coords.forEach((coord) => {
            const [lng, lat] = coord.split(",").map(Number);
            if (lat && lng) {
                puntos.push({ lat, lng });
            }
        });
    }

    // Si hay puntos, dibujar el circuito
    if (puntos.length > 0) {
        dibujarCircuito(puntos);
    } else {
        alert("No se encontraron coordenadas en el archivo KML.");
    }
}

// Función para mostrar la información del circuito
function mostrarInformacionCircuito(xmlDoc) {
    const nombre = xmlDoc.getElementsByTagName("nombre")[0]?.textContent || "Desconocido";
    const longitud = xmlDoc.getElementsByTagName("longitud")[0]?.textContent || "Desconocida";
    const anchuraMedia = xmlDoc.getElementsByTagName("anchuraMedia")[0]?.textContent || "Desconocida";
    const fechaCarrera = xmlDoc.getElementsByTagName("fechaCarrera")[0]?.textContent || "Desconocida";
    const horaInicio = xmlDoc.getElementsByTagName("horaInicio")[0]?.textContent || "Desconocida";
    const localidad = xmlDoc.getElementsByTagName("localidad")[0]?.textContent || "Desconocida";
    const pais = xmlDoc.getElementsByTagName("pais")[0]?.textContent || "Desconocido";

    const contenidoCircuito = document.getElementById("contenidoCircuito");
    contenidoCircuito.innerHTML = `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Longitud:</strong> ${longitud} km</p>
        <p><strong>Anchura Media:</strong> ${anchuraMedia} m</p>
        <p><strong>Fecha de la Carrera:</strong> ${fechaCarrera}</p>
        <p><strong>Hora de Inicio:</strong> ${horaInicio}</p>
        <p><strong>Localidad:</strong> ${localidad}</p>
        <p><strong>País:</strong> ${pais}</p>
    `;
}

// Función para dibujar el circuito en el mapa usando Google Maps
function dibujarCircuito(puntos) {
    const mapa = new google.maps.Map(document.getElementById("mapa"), {
        center: puntos[0],
    });

    const bounds = new google.maps.LatLngBounds();

    puntos.forEach((punto) => {
        new google.maps.Marker({
            position: punto,
            map: mapa
        });
        bounds.extend(punto);
    });

    const linea = new google.maps.Polyline({
        path: puntos,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: mapa
    });

    mapa.fitBounds(bounds);
}

// Evento para cargar el archivo y procesarlo
document.getElementById("archivoXML").addEventListener("change", function(event) {
    procesarArchivo(event.target.files);
});
