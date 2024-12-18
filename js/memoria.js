class Memoria {
    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        // Definición de las cartas
        this.elements = [
            "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg",
            "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg",
            "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg",
            "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg",
            "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg",
            "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg",
            "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg",
            "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg",
            "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg",
            "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
        ];

        this.shuffleElements();
        this.createElements();
    }

    // Crea los elementos y los agrega al contenedor
    createElements() {
        const container = document.querySelector("section");
        this.elements.forEach(source => {
            const card = document.createElement("article");
            card.dataset.state = "initial";

            const frontImage = document.createElement("img");
            frontImage.src = source;
            frontImage.alt = "Logo";

            const backText = document.createElement("h3");
            backText.textContent = "Tarjeta de memoria";

            card.appendChild(frontImage);
            card.appendChild(backText);
            container.appendChild(card);

            card.addEventListener("click", () => this.flipCard(card));
        });
    }

    // Girar la carta
    flipCard(card) {
        if (card.dataset.state === "revealed" || this.lockBoard || card === this.firstCard) return;

        card.dataset.state = "flipped";

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.lockBoard = true;
        this.checkForMatch();
    }

    // Verificar si las cartas coinciden
    checkForMatch() {
        const isMatch = this.firstCard.querySelector("img").src === this.secondCard.querySelector("img").src;
        isMatch ? this.disableCards() : this.unflipCards();
    }

    // Deshabilitar cartas si coinciden
    disableCards() {
        this.firstCard.dataset.state = "revealed";
        this.secondCard.dataset.state = "revealed";
        this.resetBoard();
    }

    // Voltear cartas si no coinciden
    unflipCards() {
        setTimeout(() => {
            this.firstCard.dataset.state = "initial";
            this.secondCard.dataset.state = "initial";
            this.resetBoard();
        }, 1000);
    }

    // Restablecer variables de control del tablero
    resetBoard() {
        [this.hasFlippedCard, this.lockBoard, this.firstCard, this.secondCard] = [false, false, null, null];
    }

    // Barajar las cartas
    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }
}
