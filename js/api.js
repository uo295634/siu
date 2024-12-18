const botones = document.querySelectorAll('section:nth-of-type(1) button'); // Seleccionar ambos botones
const contenedorSVG = document.querySelector('section:nth-of-type(1) div'); // Div contenedor para el SVG

// Función para limpiar el contenedor y generar un coche
function generarCoche(colores) {
    contenedorSVG.innerHTML = ''; // Limpia cualquier gráfico previo

    const svgNS = 'http://www.w3.org/2000/svg'; // Namespace para SVG
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '170');
    svg.setAttribute('viewBox', '0 0 300 150');
    svg.setAttribute('style', 'border: 1px solid black; background-color: lightgray;');

    // Dibujar las ruedas delanteras
    const ruedaDelanteraIzq = document.createElementNS(svgNS, 'circle');
    ruedaDelanteraIzq.setAttribute('cx', '80');
    ruedaDelanteraIzq.setAttribute('cy', '110');
    ruedaDelanteraIzq.setAttribute('r', '15');
    ruedaDelanteraIzq.setAttribute('fill', 'black');
    svg.appendChild(ruedaDelanteraIzq);

    const ruedaDelanteraDer = document.createElementNS(svgNS, 'circle');
    ruedaDelanteraDer.setAttribute('cx', '220');
    ruedaDelanteraDer.setAttribute('cy', '110');
    ruedaDelanteraDer.setAttribute('r', '15');
    ruedaDelanteraDer.setAttribute('fill', 'black');
    svg.appendChild(ruedaDelanteraDer);

    // Dibujar las ruedas traseras
    const ruedaTraseraIzq = document.createElementNS(svgNS, 'circle');
    ruedaTraseraIzq.setAttribute('cx', '80');
    ruedaTraseraIzq.setAttribute('cy', '55');
    ruedaTraseraIzq.setAttribute('r', '15');
    ruedaTraseraIzq.setAttribute('fill', 'black');
    svg.appendChild(ruedaTraseraIzq);

    const ruedaTraseraDer = document.createElementNS(svgNS, 'circle');
    ruedaTraseraDer.setAttribute('cx', '220');
    ruedaTraseraDer.setAttribute('cy', '55');
    ruedaTraseraDer.setAttribute('r', '15');
    ruedaTraseraDer.setAttribute('fill', 'black');
    svg.appendChild(ruedaTraseraDer);

    // Dibujar el cuerpo principal del coche
    const cuerpo = document.createElementNS(svgNS, 'rect');
    cuerpo.setAttribute('x', '50');
    cuerpo.setAttribute('y', '59');
    cuerpo.setAttribute('width', '170');
    cuerpo.setAttribute('height', '50');
    cuerpo.setAttribute('fill', colores.cuerpo);
    svg.appendChild(cuerpo);

    // Dibujar la cabina
    const cabina = document.createElementNS(svgNS, 'rect');
    cabina.setAttribute('x', '140');
    cabina.setAttribute('y', '70');
    cabina.setAttribute('width', '40');
    cabina.setAttribute('height', '30');
    cabina.setAttribute('fill', colores.cabina);
    svg.appendChild(cabina);

    // Dibujar el alerón trasero
    const aleron = document.createElementNS(svgNS, 'rect');
    aleron.setAttribute('x', '45');
    aleron.setAttribute('y', '54');
    aleron.setAttribute('width', '25');
    aleron.setAttribute('height', '60');
    aleron.setAttribute('fill', colores.aleron);
    svg.appendChild(aleron);

    // Dibujar el alerón delantero
    const aleronDelantero = document.createElementNS(svgNS, 'rect');
    aleronDelantero.setAttribute('x', '260');
    aleronDelantero.setAttribute('y', '46');
    aleronDelantero.setAttribute('width', '25');
    aleronDelantero.setAttribute('height', '75');
    aleronDelantero.setAttribute('fill', colores.aleron);
    svg.appendChild(aleronDelantero);

    // Dibujar triangulo delantero
    const tri = document.createElementNS(svgNS, 'polygon');
    tri.setAttribute('points', "280,82  218,59 218,109");
    tri.setAttribute('fill', colores.triangulo);
    svg.appendChild(tri);

    // Agregar el gráfico SVG al contenedor
    contenedorSVG.appendChild(svg);
}

// Asignar eventos a los botones
botones[0].addEventListener('click', () => {
    generarCoche({ cuerpo: 'teal', cabina: 'black', aleron: 'black', triangulo : 'teal' }); // Aston Martin
});

botones[1].addEventListener('click', () => {
    generarCoche({ cuerpo: 'deepskyblue', cabina: 'dodgerblue', aleron: 'blue', triangulo : 'yellow' }); // Renault 2008
});


// Drag and Drop: Juego de emparejar circuitos con ciudades
const circuitos = document.getElementsByTagName('li'); // Todos los elementos <li>
const ciudades = document.querySelectorAll('ul:last-child li'); // Segunda lista de ciudades
const mensajeVictoria = document.querySelector('section > p:last-of-type'); // Párrafo para mostrar victoria
let emparejamientosCorrectos = 0; // Contador de emparejamientos correctos

Array.from(circuitos).forEach(circuito => {
    if (circuito.hasAttribute('draggable')) {
        circuito.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text', event.target.textContent);
        });
    }
});

ciudades.forEach(ciudad => {
    ciudad.addEventListener('dragover', event => {
        event.preventDefault();
    });

    ciudad.addEventListener('drop', event => {
        event.preventDefault();
        const circuito = event.dataTransfer.getData('text');
        if (circuito === ciudad.getAttribute('data-correct')) {
            ciudad.style.backgroundColor = 'green';
            ciudad.textContent += ` (${circuito})`; // Añadir circuito emparejado
            ciudad.style.pointerEvents = 'none'; // Deshabilitar interacción
            emparejamientosCorrectos++;

            if (emparejamientosCorrectos === 10) {
                mensajeVictoria.textContent = '¡Felicidades! Has ganado el juego.';
            }
        } else {
            ciudad.style.backgroundColor = 'red';
            setTimeout(() => ciudad.style.backgroundColor = '', 500); // Restablece color
        }
    });
});

// API Web Storage - Guardar circuitos favoritos
const botonGuardarCircuito = document.querySelectorAll('button')[2]; // Tercer botón para guardar circuito
const inputCircuitoFavorito = document.querySelector('input'); // El primer input para el nombre del circuito
const circuitoGuardadoSpan = document.querySelectorAll('span')[1]; // El segundo span para mostrar el circuito guardado

botonGuardarCircuito.addEventListener('click', guardarCircuito);

function guardarCircuito() {
    const circuito = inputCircuitoFavorito.value;
    if (circuito) {
        localStorage.setItem("circuitoFavorito", circuito);
        mostrarCircuitoGuardado();
    }
}

function mostrarCircuitoGuardado() {
    const circuitoGuardado = localStorage.getItem("circuitoFavorito");
    circuitoGuardadoSpan.textContent = circuitoGuardado ? circuitoGuardado : "No has guardado un circuito";
}
