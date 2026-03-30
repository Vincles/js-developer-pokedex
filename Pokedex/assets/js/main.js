const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 151
let offset = 0;

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const legendaries = [144, 145, 146, 150, 151];

        const newHtml = pokemons.map((pokemon) => {
            const isLegendary = legendaries.includes(pokemon.number);
            const legendaryClass = isLegendary ? 'legendary' : '';

            return `
                <li class="pokemon ${pokemon.type} ${legendaryClass}" data-id="${pokemon.number}">
                    <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
                    
                    <span class="name">
                        ${pokemon.name}
                        ${isLegendary ? '<i class="star-icon">⭐</i>' : ''}
                    </span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>

                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>
            `;
        }).join('');

        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit)

pokemonList.addEventListener('click', (event) => {
    const pokemonCard = event.target.closest('.pokemon');
    
    if (pokemonCard) {
        const pokemonId = pokemonCard.getAttribute('data-id');
        
        if (typeof openPokemonDetails === "function") {
            openPokemonDetails(parseInt(pokemonId));
        }
    }
});

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

function switchTheme(e) {
  if (e.target.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
}
toggleSwitch.addEventListener('change', switchTheme, false);

if (currentTheme) {
  document.body.classList.add(currentTheme === 'dark' ? 'dark-mode' : 'light-mode');
  if (currentTheme === 'dark') toggleSwitch.checked = true;
}