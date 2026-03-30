const fabContainer = document.getElementById("fab-container");
const fabMainBtn = document.getElementById("fab-main-btn");
const typeButtons = document.querySelectorAll(".type-filter");

// 1. Lógica para expandir/encolher o FAB
fabMainBtn.addEventListener("click", () => {
    fabContainer.classList.toggle("active");
});

// 2. Lógica de Filtragem (reaproveitada e ajustada)
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const typeSelected = button.getAttribute('data-type');
        const allPokemonCards = document.querySelectorAll('.pokemon');

        allPokemonCards.forEach(card => {
            // Reaproveita sua lógica de mostrar/esconder
            if (typeSelected === 'all' || card.classList.contains(typeSelected)) {
                card.style.display = "flex"; // Ou o display original do seu card
            } else {
                card.style.display = "none";
            }
        });

        // 3. Encolher o FAB após selecionar um filtro
        fabContainer.classList.remove("active");
    });
});

const searchInput = document.getElementById("pokemon-search");

// Função para filtrar os cards (reutilizável)
function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    const allPokemonCards = document.querySelectorAll('.pokemon');

    allPokemonCards.forEach(card => {
        // Pegamos o nome que está dentro do <span> ou <h2> do seu card
        const pokemonName = card.querySelector('.name').textContent.toLowerCase();
        
        // Verifica se o nome do Pokémon contém o que foi digitado
        if (pokemonName.includes(searchTerm)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Evento de Digitação (input): Filtra enquanto o usuário digita
searchInput.addEventListener('input', filterPokemon);

// Dica: Para evitar que o clique no input feche o menu, adicione isso:
searchInput.addEventListener('click', (e) => e.stopPropagation());