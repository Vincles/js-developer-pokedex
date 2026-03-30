
const modalOverlay = document.getElementById("modal-overlay");
const modalHeader = modalOverlay.querySelector(".modal-header");
const btnClose = document.getElementById("close-modal");
const tabLinks = document.querySelectorAll(".tab-link");
const tabPanels = document.querySelectorAll(".tab-panel");

function closeModal() {
    modalOverlay.classList.remove("open");
}

btnClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});

tabLinks.forEach(link => {
    link.addEventListener("click", () => {
        const tabId = link.getAttribute("data-tab");

        tabLinks.forEach(l => l.classList.remove("active"));
        tabPanels.forEach(p => p.classList.remove("active"));
        link.classList.add("active");
        document.getElementById(tabId).classList.add("active");
    });
});

function setupPokemonCardLinks() {
    const pokemonCards = document.querySelectorAll('.pokemon');

    pokemonCards.forEach(card => {
        card.addEventListener('click', () => {
            const pokemonIdText = card.querySelector('.number').textContent;
            const pokemonId = parseInt(pokemonIdText.replace('#', ''));
            
            openPokemonDetails(pokemonId);
        });
    });
}

async function openPokemonDetails(id) {
    console.log(`Buscando detalhes do Pokémon ID: ${id}`);
    
    modalOverlay.classList.add("open");

    try {
        
        const [pokemonData, speciesData] = await Promise.all([
            pokeApi.getPokemonDetailsById(id),
            pokeApi.getPokemonSpeciesById(id)
        ]);

        const isLegendary = speciesData.is_legendary || speciesData.is_mythical;

        if (isLegendary) {
            modalOverlay.classList.add("legendary-highlight");
            const flameLabel = document.getElementById("modal-pokemon-flame");
            
            flameLabel.innerHTML = `${getGenera(speciesData)} <span class="badge-legendary">Legendary</span>`;
        } else {
            modalOverlay.classList.remove("legendary-highlight");
            document.getElementById("modal-pokemon-flame").textContent = getGenera(speciesData);
        }

const evolutionData = await pokeApi.getEvolutionChain(speciesData.evolution_chain.url);

const evolutionChain = [];
let currentStep = evolutionData.chain;

do {
    const pokemonName = currentStep.species.name;
    const pokemonId = currentStep.species.url.split('/').slice(-2, -1)[0];
    
    evolutionChain.push({
        name: pokemonName,
        id: pokemonId,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    });

    currentStep = currentStep.evolves_to[0];
} while (currentStep);

const evoContainer = document.getElementById("evolution-chain-container");
evoContainer.innerHTML = evolutionChain.map((step, index) => {
    const isLast = index === evolutionChain.length - 1;
    return `
        <div class="evolution-step">
            <div class="evo-pokemon">
                <img src="${step.image}" alt="${step.name}">
                <span>${step.name}</span>
            </div>
            ${!isLast ? '<div class="evo-arrow">➔</div>' : ''}
        </div>
    `;
}).join('');

        modalHeader.style.backgroundColor = getPokemonColorByType(pokemonData.type);
        document.getElementById("modal-pokemon-number").textContent = `#${String(id).padStart(3, '0')}`;
        document.getElementById("modal-pokemon-name").textContent = pokemonData.name;
        document.getElementById("modal-pokemon-image").src = pokemonData.photo;
        document.getElementById("modal-pokemon-flame").textContent = getGenera(speciesData);

        const typesContainer = document.getElementById("modal-pokemon-types");
        typesContainer.innerHTML = pokemonData.types.map(type => `<span class="type ${type}">${type}</span>`).join('');

        const heightM = pokemonData.height / 10;
        const totalInches = heightM * 39.37;
        const feet = Math.floor(totalInches / 12);
        const inches = (totalInches % 12).toFixed(1);
        
        const weightKg = pokemonData.weight / 10;
        const weightLbs = (weightKg * 2.204).toFixed(1);

        const abilities = pokemonData.abilities.map(a => a.ability.name).join(', ');

        document.getElementById("val-species").textContent = getGenera(speciesData);
        document.getElementById("val-height").textContent = `${(heightM * 100).toFixed(0)} cm (${feet}'${inches}")`;
        document.getElementById("val-weight").textContent = `${weightKg.toFixed(1)} kg (${weightLbs} lbs)`;
        document.getElementById("val-abilities").textContent = abilities;

        const statsContainer = document.getElementById("stats-container");
        
        statsContainer.innerHTML = pokemonData.stats.map(stat => {
            const baseStat = stat.base_stat;
            const barWidth = Math.min(baseStat, 100); 
            const barColor = baseStat >= 50 ? '#4BC07A' : '#FB6C6C';

            return `
                <div class="stat-row">
                    <span class="stat-label">${formatStatName(stat.stat.name)}</span>
                    <span class="stat-value">${baseStat}</span>
                    <div class="stat-bar-bg">
                        <div class="stat-bar-fill" style="width: ${barWidth}%; background-color: ${barColor}"></div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        closeModal();
    }
}

function formatStatName(name) {
    const names = {
        'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF',
        'special-attack': 'SATK', 'special-defense': 'SDEF', 'speed': 'SPD'
    };
    return names[name] || name;
}

function getGenera(speciesData) {
    const genera = speciesData.genera.find(g => g.language.name === 'en');
    
    let text = genera ? genera.genus : '';
    text = text.replace(/Pokémon/g, "Pokemon");

    return text;
}

function getPokemonColorByType(type) {
    const colors = {
        fire: '#f08030', water: '#6890f0', grass: '#78c850', electric: '#f8d030',
        ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0', ground: '#e0c068',
        flying: '#a890f0', psychic: '#f85888', bug: '#a8b020', rock: '#b8a038',
        ghost: '#705898', dragon: '#7038f8', dark: '#705848', steel: '#b8b8d0',
        fairy: '#ee99ac', normal: '#a8a878'
    };
    return colors[type] || '#a8a878';
}

