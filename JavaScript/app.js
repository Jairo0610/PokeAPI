//función para extraer los datos del archivo JSON creado de la clase pokemon
let pokemons;
async function getPokeJSON() {
    try {
        const response = await fetch("../JavaScript/dataPokemon.json");
        pokemons = await response.json();
        console.log(pokemons)
        return pokemons;
    }
    catch (error) {
        console.error('Error al cargar los pokemons: ', error)
    }
}

getPokeJSON()

//clase Pokedex que contiene todos los metodos necesarios para dibujar la pokedex

class Pokedex {
    //creamos un array como atributo privado para almacenar los pokemons
    #pokemons = [];

    constructor() {
        this.#pokemons = [];
    }

    cargarDatosPokemons(arrayPokemons) {
        this.#pokemons = arrayPokemons;
    }

    #generarHeaderCard(pokemon) {
        const headerContenedor = document.createElement("div");

        const contendorBtnFavorite = document.createElement("div");
        const btnFavorite = document.createElement("p");

        const contenedorID = document.createElement('div');
        const pokemonID = document.createElement('p');
        const imgPokeBall = document.createElement('img');
        imgPokeBall.src = "../Recursos/pokeballNumeracion.svg";
        const numID = document.createElement('span');


        btnFavorite.innerHTML = "<i class='bx bx-heart' style='color:#ffffff'></i>";
        numID.textContent = pokemon.id.toString().padStart(4, '0');

        // Agregar clases a los elementos
        headerContenedor.classList.add("card__pokemon__header");
        contendorBtnFavorite.classList.add("card__header__favorite");
        btnFavorite.classList.add("agregarFavorito");

        contenedorID.classList.add("card__header__numPokemon");
        pokemonID.classList.add("pokemonID");

        pokemonID.appendChild(imgPokeBall);
        pokemonID.appendChild(numID);

        contendorBtnFavorite.appendChild(btnFavorite);
        contenedorID.appendChild(pokemonID);

        headerContenedor.appendChild(contendorBtnFavorite);
        headerContenedor.appendChild(contenedorID);

        return headerContenedor;
    }

    #generarPokemonImage(pokemon) {
        const contenedorImagen = document.createElement('div');
        const pokeImagen = document.createElement('img');

        pokeImagen.src = pokemon.sprites;

        pokeImagen.classList.add("pokemonImagen");
        contenedorImagen.classList.add("pokemonImagenContenedor");

        contenedorImagen.appendChild(pokeImagen);

        return contenedorImagen;
    }

    #generarInformacionGeneral(pokemon) {
        const coloresTipos = {
            normal: '#A8A77A',
            fire: '#EE8130',
            water: '#6390F0',
            electric: '#F7D02C',
            grass: '#7AC74C',
            ice: '#96D9D6',
            fighting: '#C22E28',
            poison: '#A33EA1',
            ground: '#E2BF65',
            flying: '#A98FF3',
            psychic: '#F95587',
            bug: '#A6B91A',
            rock: '#B6A136',
            ghost: '#735797',
            dragon: '#6F35FC',
            dark: '#705746',
            steel: '#B7B7CE',
            fairy: '#D685AD',
        };

        const tipoEsp = {
            normal: 'normal',
            fire: 'fuego',
            water: 'agua',
            electric: 'electrico',
            grass: 'planta',
            ice: 'hielo',
            fighting: 'pelea',
            poison: 'veneno',
            ground: 'tierra',
            flying: 'volador',
            psychic: 'psiquico',
            bug: 'bicho',
            rock: 'roca',
            ghost: 'fantasma',
            dragon: 'dragon',
            dark: 'oscuro',
            steel: 'acero',
            fairy: 'hada',
        }

        const cardContenedorInformacion = document.createElement('div');
        const pokeNombre = document.createElement('h3');
        const contenedorPokeTipo = document.createElement('div');
        const btnDetalles = document.createElement('button');
        btnDetalles.innerText = "Más Detalles"
        contenedorPokeTipo.innerHTML = "";

        pokemon.tipo.forEach(tipo => {
            let type = tipo.toLowerCase();

            const h5 = document.createElement('h5');
            h5.style.backgroundColor = coloresTipos[type]
            h5.classList.add('pokemonTipo');
            h5.innerText = tipoEsp[type] || type

            contenedorPokeTipo.appendChild(h5)
        });

        pokeNombre.classList.add("pokemonNombre");
        pokeNombre.innerText = pokemon.nombre;

        contenedorPokeTipo.classList.add("pokemonTipoList")
        btnDetalles.classList.add("btnDetalles")


        cardContenedorInformacion.classList.add("card__pokemon__informacion");
        cardContenedorInformacion.appendChild(pokeNombre);
        cardContenedorInformacion.appendChild(contenedorPokeTipo);
        cardContenedorInformacion.appendChild(btnDetalles);

        return cardContenedorInformacion;
    }

    #dibujarPokemon(pokemon) {

        const coloresTipos = {
            normal: '#A8A77A',
            fire: '#EE8130',
            water: '#6390F0',
            electric: '#F7D02C',
            grass: '#7AC74C',
            ice: '#96D9D6',
            fighting: '#C22E28',
            poison: '#A33EA1',
            ground: '#E2BF65',
            flying: '#A98FF3',
            psychic: '#F95587',
            bug: '#A6B91A',
            rock: '#B6A136',
            ghost: '#735797',
            dragon: '#6F35FC',
            dark: '#705746',
            steel: '#B7B7CE',
            fairy: '#D685AD',
        };


        //Cargar los datos y mostrarlas en el frond



        const card = document.createElement('div');
        card.classList.add("card__pokemon");

        card.appendChild(this.#generarHeaderCard(pokemon));
        card.appendChild(this.#generarPokemonImage(pokemon));
        card.appendChild(this.#generarInformacionGeneral(pokemon));
        card.style.backgroundImage = `url('../Recursos/pokeball.svg'), linear-gradient(to top, ${coloresTipos[pokemon.tipo[0]]}, #010215, #010215)`;

        return card;
    }

    dibujarPokedex() {
        const container = document.getElementById("data-pokemons");
        container.innerHTML = ""; // Limpiar contenido previo



        this.#pokemons.forEach(pokemon => {
            const col = document.createElement("div");
            col.classList.add("col-3");
            col.style = "padding: 10px"
            col.appendChild(this.#dibujarPokemon(pokemon))
            container.appendChild(col);
        })


    }

}

window.addEventListener("DOMContentLoaded", async () => {
    const datos = await getPokeJSON();
    const pokedex = new Pokedex();
    pokedex.cargarDatosPokemons(datos);
    pokedex.dibujarPokedex();
});
