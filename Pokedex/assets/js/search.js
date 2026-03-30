const fabContainer = document.getElementById("fab-container");
const fabMainBtn = document.getElementById("fab-main-btn");
const typeButtons = document.querySelectorAll(".type-filter");

fabMainBtn.addEventListener("click", () => {
    fabContainer.classList.toggle("active");
});

typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const typeSelected = button.getAttribute('data-type');
        const allPokemonCards = document.querySelectorAll('.pokemon');

        allPokemonCards.forEach(card => {

            if (typeSelected === 'all' || card.classList.contains(typeSelected)) {
                card.style.display = "flex"; 
            } else {
                card.style.display = "none";
            }
        });

        fabContainer.classList.remove("active");
    });
});

const searchInput = document.getElementById("pokemon-search");

function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const allPokemonCards = document.querySelectorAll('.pokemon');

    allPokemonCards.forEach(card => {

        const pokemonName = card.querySelector('.name').textContent.toLowerCase();
        
        if (pokemonName.includes(searchTerm)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

searchInput.addEventListener('input', filterPokemon);

searchInput.addEventListener('click', (e) => e.stopPropagation());
