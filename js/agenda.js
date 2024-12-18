// Tarea 3: Llamada al servicio web y mostrar las carreras

// Clase Agenda
class Agenda {
    // Constructor para inicializar la URL de la API
    constructor() {
        this.apiUrl = "https://ergast.com/api/f1/2024.json"; // URL de la API de Ergast
    }

    // Método para obtener las carreras de la temporada 2024 y mostrar la información
    obtenerCarreras() {
        // Realizamos una solicitud GET a la API para obtener las carreras
        $.getJSON(this.apiUrl)
            .done(function(data) {
                // Al recibir los datos, mostramos las carreras
                const races = data.MRData.RaceTable.Races;

                if (races && races.length > 0) {
                    // Creamos una lista vacía que se llenará con las carreras
                    let raceList = "";

                    // Iteramos sobre las carreras para mostrarlas
                    races.forEach(function(race) {
                        // Extraemos la información de cada carrera
                        const raceName = race.raceName;
                        const circuitName = race.Circuit.circuitName;
                        const circuitLat = race.Circuit.Location.lat;
                        const circuitLon = race.Circuit.Location.long;
                        const date = race.date;
                        const time = race.time ? race.time : "Hora no disponible"; // Si no hay hora, mostramos un mensaje

                        // Añadimos la información de la carrera a la lista, utilizando la estructura de grid
                        raceList += `
                            <article class="agenda-item">
                                <header>
                                    <h3>${raceName}</h3>
                                </header>
                                <p><strong>Circuito:</strong> ${circuitName}</p>
                                <p><strong>Ubicación:</strong> ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
                                <p><strong>Coordenadas:</strong> Latitud ${circuitLat}, Longitud ${circuitLon}</p>
                                <p><strong>Fecha:</strong> ${date}</p>
                                <p><strong>Hora:</strong> ${time}</p>
                            </article>
                        `;
                    });

                    $("section").html(raceList); // Muestra la lista de carreras en el contenedor con id "agenda-carreras"
                } else {
                    $("section").html("<p>No se han encontrado carreras para la temporada 2024.</p>");
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log("Error al obtener los datos:", textStatus, errorThrown);
                $("section").html("<p>Error al obtener los datos de la API.</p>");
            });
    }
}
