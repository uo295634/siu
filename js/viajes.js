"use strict";

class Geolocalizacion {
    constructor(apiKey) {
        this.apiKey = apiKey; // Clave de la API de Google Maps
        this.longitud = null;
        this.latitud = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.getPosicion.bind(this),
                this.errorCallback.bind(this)
            );
        } else {
            this.mostrarError("Geolocalización no soportada en este navegador.");
        }
    }

    // Manejar posición obtenida
    getPosicion(posicion) {
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;

        // Generar el mapa dinámico
        this.generarMapaDinamico();
    }

    // Manejar errores de geolocalización
    errorCallback(error) {
        let mensajeError = "Error al obtener la geolocalización.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                mensajeError = "El usuario denegó el permiso para acceder a la geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                mensajeError = "La información de geolocalización no está disponible.";
                break;
            case error.TIMEOUT:
                mensajeError = "El tiempo de espera para obtener la geolocalización se agotó.";
                break;
            case error.UNKNOWN_ERROR:
                mensajeError = "Ocurrió un error desconocido.";
                break;
        }
        this.mostrarError(mensajeError);
    }
    // Generar un mapa dinámico de Google Maps
    generarMapaDinamico() {
        const contenedorMapa = document.body.querySelectorAll("section > div")[0]; // primer div para el mapa
        const opcionesMapa = {
            center: { lat: this.latitud, lng: this.longitud },
            zoom: 15,
        };

        // Crear el mapa
        const mapa = new google.maps.Map(contenedorMapa, opcionesMapa);

        // Agregar un marcador en la posición del usuario
        new google.maps.Marker({
            position: { lat: this.latitud, lng: this.longitud },
            map: mapa,
            title: "Tu ubicación",
        });
    }

    // Mostrar errores en la página
    mostrarError(mensaje) {
        const contenedor = document.body.querySelector("div");
        contenedor.innerHTML = `<p style="color: red;">${mensaje}</p>`;
    }
}



// Inicializar la clase con la clave de la API de Google Maps
const apiKey = "AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU"; // Reemplaza con tu clave de Google Maps
const geolocalizacion = new Geolocalizacion(apiKey);
