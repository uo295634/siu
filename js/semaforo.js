class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8]; // Niveles de dificultad
        this.unload_moment = null; // Momento de apagado
        this.clic_moment = null; // Momento del clic
        this.difficulty = null; // Nivel de dificultad actual
    }

    initSequence() {
        this.clearReactionMessage();
        const reactButton = document.querySelectorAll('button')[1];
        reactButton.disabled = true;

        const startButton = document.querySelectorAll('button')[0];
        startButton.disabled = true;

        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.animateLights();

        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, 1500 * this.difficulty + 3000);
    }

    animateLights() {
        const lights = document.querySelectorAll('main > div');
        let delay = 0;

        lights.forEach((light, index) => {
            setTimeout(() => {
                light.classList.add('active');
            }, delay);
            delay += 1000;
        });
    }

    endSequence() {
        const lights = document.querySelectorAll('main > div');
        lights.forEach(light => light.classList.remove('active'));

        const reactButton = document.querySelectorAll('button')[1];
        reactButton.disabled = false;

        const startButton = document.querySelectorAll('button')[0];
        startButton.disabled = false;
    }

    stopReaction() {
        this.clic_moment = new Date();
        const reactionTime = this.clic_moment - this.unload_moment;
        const roundedTime = Math.round(reactionTime * 1000) / 1000;

        const reactionTimeParagraph = document.createElement('p');
        reactionTimeParagraph.textContent = `Tu tiempo de reacción es: ${roundedTime} ms`;
        document.querySelector('main').appendChild(reactionTimeParagraph);

        const reactButton = document.querySelectorAll('button')[1];
        reactButton.disabled = true;

        // Llamada al método para crear el formulario
        this.createRecordForm(roundedTime);
    }

    clearReactionMessage() {
        const existingMessage = document.querySelector('main p');
        if (existingMessage) {
            existingMessage.remove();
        }

        const existingForm = document.querySelector('main form');
        if (existingForm) {
            existingForm.remove();
        }
    }

    createRecordForm(reactionTime) {
        // Crear el formulario dinámicamente con jQuery
        const $form = $(`
            <form method="post" action="semaforo.php">
                <fieldset>
                    <legend>Guardar Récord</legend>
                    
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" name="name" required />
                    <br>
                    
                    <label for="surname">Apellidos:</label>
                    <input type="text" id="surname" name="surname" required />
                    <br>
                    
                    <!-- Campos ocultos para nivel y tiempo de reacción -->
                    <input type="hidden" id="difficulty" name="difficulty" value="${parseFloat(this.difficulty).toFixed(1)}" />
                    <input type="hidden" id="reactionTime" name="reactionTime" value="${reactionTime}" />
                    
                    <button type="submit">Guardar</button>
                </fieldset>
            </form>
        `);
    
        // Añadir el formulario al <main>
        $('main').append($form);
    }
    
}

// Crear una instancia de Semaforo
const semaforo = new Semaforo();
