class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuitoF1 = "";
        this.formaGobierno = "";
        this.coordenadasMeta = { latitud: null, longitud: null };
        this.religionMayoritaria = "";
    }

    inicializarAtributos(circuitoF1, formaGobierno, coordenadasMeta, religionMayoritaria) {
        this.circuitoF1 = circuitoF1;
        this.formaGobierno = formaGobierno;
        this.coordenadasMeta = coordenadasMeta;
        this.religionMayoritaria = religionMayoritaria;
    }

    cargarPronostico(lat, lon) {
        const apiKey = "47b790fd0fc41878c80c57c9846132cb"; // Sustituye con tu clave de OpenWeatherMap
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function(data) {
                $("main article").empty();

                for (let i = 0; i < 5; i++) {
                    const dia = data.list[i * 8];
                    const fecha = new Date(dia.dt * 1000);
                    const maxTemp = dia.main.temp_max;
                    const minTemp = dia.main.temp_min;
                    const humedad = dia.main.humidity;
                    const descripcion = dia.weather[0].description;
                    const icono = `https://openweathermap.org/img/wn/${dia.weather[0].icon}.png`;
                    const lluvia = dia.rain ? dia.rain["3h"] : 0;

                    const articulo = document.getElementsByTagName('article')[i];
                    
                    articulo.innerHTML = `
                        <h3>Fecha: ${fecha.toLocaleDateString()}</h3>
                        <p><strong>Temperatura Máxima:</strong> ${maxTemp}°C</p>
                        <p><strong>Temperatura Mínima:</strong> ${minTemp}°C</p>
                        <p><strong>Humedad:</strong> ${humedad}%</p>
                        <p><strong>Descripción:</strong> ${descripcion}</p>
                        <img src="${icono}" alt="Icono del clima">
                        <p><strong>Lluvia:</strong> ${lluvia} mm</p>
                    `;
                }
            },
            error: function(error) {
                console.error("Error al obtener los datos meteorológicos:", error);
            }
        });
    }
}

$(document).ready(function() {
    const lat = -37.8497;
    const lon = 144.968;
    const pais = new Pais("Australia", "Canberra", 25000000);
    pais.cargarPronostico(lat, lon);
});
