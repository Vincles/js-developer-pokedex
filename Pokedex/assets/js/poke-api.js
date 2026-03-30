
const pokeApi = {}

function convertApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon ()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.abilities = pokeDetail.abilities;
    pokemon.stats = pokeDetail.stats;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other["official-artwork"].front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 151) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
.then((response) => response.json())
.then((jsonBody) => jsonBody.results)
.then((pokemons) => pokemons.map (pokeApi.getPokemonDetail))
.then((detailRequest) => Promise.all(detailRequest))
.then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonDetailsById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertApiDetailToPokemon);
};

pokeApi.getPokemonSpeciesById = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    return fetch(url).then((response) => response.json());
};

pokeApi.getEvolutionChain = (url) => {
    return fetch(url)
        .then((response) => response.json());
}
