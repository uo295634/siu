class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("API File soportada.");
        } else {
            alert("Este navegador no soporta la API File.");
        }
    }

    // Método para leer el archivo de noticias y mostrar su contenido
    readInputFile(file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const content = event.target.result;
            const lines = content.split("\n");

            // Seleccionar el contenedor principal (main)
            const main = document.querySelector("main");
            main.innerHTML = ""; // Limpiar contenido previo

            lines.forEach(line => {
                const [titulo, entradilla, autor] = line.split("_");
                if (titulo && entradilla && autor) {
                    const article = document.createElement("article");
                    article.innerHTML = `
                        <h3>${titulo}</h3>
                        <p>${entradilla}</p>
                        <p><strong>Autor:</strong> ${autor}</p>
                    `;
                    main.appendChild(article);
                }
            });
        };

        reader.readAsText(file);
    }

    // Método para añadir una nueva noticia
    addNoticia(titulo, entradilla, autor) {
        if (titulo && entradilla && autor) {
            const main = document.querySelector("main");
            const article = document.createElement("article");

            article.innerHTML = `
                <h3>${titulo}</h3>
                <p>${entradilla}</p>
                <p><strong>Autor:</strong> ${autor}</p>
            `;

            main.appendChild(article);
        } else {
            alert("Todos los campos son obligatorios.");
        }
    }
}

// Instanciar la clase Noticias y manejar los eventos
document.addEventListener("DOMContentLoaded", function () {
    const noticias = new Noticias();

    // Evento para el input de archivo
    document.querySelector("input[type='file']").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            noticias.readInputFile(file);
        }
    });

    // Evento para el botón de añadir noticia
    document.querySelector("form button[type='button']").addEventListener("click", function () {
        const form = this.closest("form");
        const titulo = form.querySelector("input[name='titulo']").value;
        const entradilla = form.querySelector("input[name='entradilla']").value;
        const autor = form.querySelector("input[name='autor']").value;

        noticias.addNoticia(titulo, entradilla, autor);

        // Limpiar campos del formulario
        form.reset();
    });
});
