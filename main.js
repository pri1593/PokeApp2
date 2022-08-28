const baseURL = 'https://pokeapi.co/api/v2/pokemon/';
const caja = document.getElementById('caja');
const pokeballs = document.querySelector('.pokeballs-container');


let isFetching = false;

const nextURL = {
    // sirve para guardar una parte de la api, arranca en null por que todavia
    // se hizo la llamda a la api
    next: null,
};
const renderCard = pokemon =>{
    const {
        id, name, sprites, height, weight, types, base_experience
    } = pokemon;
    return ` 
    <div class="poke">
        <img src="${sprites.other.home.front_default}" alt=""/>
        <h2>${name.toUpperCase()}</h2>
        <span class="exp">Exp: ${base_experience}</span>
        <div class="tipo-poke">
            ${types.map(tipo =>{
                return `<span class ="${tipo.type.name}
                poke__type">${tipo.type.name}</span>`
            }).join('')}
        </div>
        <p class="id-poke">#${id}</p>
        <p class="height">Height: ${height / 10}</p>
        <p class="weight">Weight: ${weight / 10} Kg</p>
    </div>
    `
};

const renderPokeList = pokelist => {
    const cards = pokelist.map(pokemon =>{
        return renderCard(pokemon)
    }).join('');
    caja.innerHTML += cards;
};

const fetchPokemones = async () =>{
    isFetching = true;
    const res = await fetch(`${baseURL}?limit=8&offset=0`);
    const data = await res.json();
    isFetching = false;
    return data
};

const loadPrint = pokemonlist => {
    pokeballs.classList.add('show');
    setTimeout(() => {
        pokeballs.classList.remove('show');
        renderPokeList(pokemonlist)
    }, 1500);
};

fetchPokemones()
const init = () => {
    window.addEventListener('DOMContentLoaded', async () =>{
        let {next, results} = await fetchPokemones();
        nextURL.next = next;
        const URLS = results.map(pokemon => pokemon.url);
        const InfoPokemones = await Promise.all(URLS.map(async url => {
            const nextPokemones = await fetch(url);
            return await nextPokemones.json();
        }));
        renderPokeList(InfoPokemones)
    });

    window.addEventListener('scroll', async () =>{
        const{ scrollTop, clientHeight, scrollHeight} = document.documentElement;
        const bottom = scrollTop + clientHeight >= scrollHeight - 2;
        if(bottom){
            const nextPokemones = await fetch(nextURL.next);
            const{ next, results } = await nextPokemones.json();
            nextURL.next = next;
            const URLS = results.map(pokemon => pokemon.url);
            const InfoPokemones = await Promise.all(
                URLS.map(async url => {
                    const nextPokemones = await fetch(url);
                    return await nextPokemones.json();
                })
            );
            loadPrint(InfoPokemones)
        }
    });
};
init()