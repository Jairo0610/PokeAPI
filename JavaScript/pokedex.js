
import { esFavorito, alternarFavorito } from './data.js';
import { obtenerAcompanantesDB, eliminarAcompananteDB } from './db.js';
import { agregarAcompananteIndexed } from './pokedexView.js';
import { showPokemonDetails } from './detalles.js';

// Clase Pokedex para manejar pokemones y acompañantes
export class Pokedex {
    #pokemons = [];
    #acompanantesIds = new Set();

    constructor() {
        this.#pokemons = [];
        this.#acompanantesIds = new Set();
    }

    cargarDatosPokemons(arrayPokemons) {
        this.#pokemons = arrayPokemons;
    }

    async cargarAcompanantes() {
        const acompanantes = await obtenerAcompanantesDB();
        this.#acompanantesIds = new Set(acompanantes.map(a => a.pokemonId));
    }

    esAcompanante(id) {
        return this.#acompanantesIds.has(id);
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

        const btnAcompanante = document.createElement("p");
        btnAcompanante.classList.add("agregarAcompanante");

        // Favorito (dejas igual)
        btnFavorite.innerHTML = esFavorito(pokemon.id)
            ? "<i class='bx bxs-heart' style='color:#e74c3c'></i>"
            : "<i class='bx bx-heart' style='color:#ffffff'></i>";


        btnFavorite.addEventListener("click", () => {
            alternarFavorito(pokemon.id);
            btnFavorite.innerHTML = esFavorito(pokemon.id)
                ? "<i class='bx bxs-heart' style='color:#e74c3c'></i>"
                : "<i class='bx bx-heart' style='color:#ffffff'></i>";


            // Si estamos en la vista de favoritos, volver a cargarla
            const favoritosActivos = document.getElementById("btnMostrarFavoritos").classList.contains("active");
            if (favoritosActivos) {
                const favoritos = obtenerFavoritos();
                const todos = this.obtenerTodos();
                const filtrados = todos.filter(p => favoritos.includes(p.id));
                const mensajeVacio = document.getElementById("mensaje-vacio");

                if (filtrados.length === 0) {
                    mensajeVacio.style.display = "block";
                    mensajeVacio.textContent = "Aún no tienes pokemones favoritos.";
                    document.getElementById("data-pokemons").innerHTML = "";
                } else {
                    mensajeVacio.style.display = "none";
                    this.dibujarPokemonsFiltrados(filtrados);
                }
            }

        });

        // Acompañante con IndexedDB
        btnAcompanante.innerHTML = this.esAcompanante(pokemon.id)
            ? "<i class='bx bxs-star' style='color:#f1c40f'></i>"
            : "<i class='bx bx-star' style='color:#ffffff'></i>";

        btnAcompanante.addEventListener("click", async () => {
            const acompanantes = await obtenerAcompanantesDB();
            const yaAcompanante = acompanantes.some(a => a.pokemonId === pokemon.id);

            if (yaAcompanante) {
                if (confirm("¿Quieres eliminar este Pokémon de tus acompañantes?")) {
                    const acompObj = acompanantes.find(a => a.pokemonId === pokemon.id);
                    await eliminarAcompananteDB(acompObj.id);
                    btnAcompanante.innerHTML = "<i class='bx bx-star' style='color:#ffffff'></i>";
                    await this.cargarAcompanantes();
                    this.dibujarPokedex();
                }
            } else {
                await agregarAcompananteIndexed(pokemon.id);
                btnAcompanante.innerHTML = "<i class='bx bxs-star' style='color:#f1c40f'></i>";
                await this.cargarAcompanantes();
                this.dibujarPokedex();
            }
        });

        numID.textContent = pokemon.id.toString().padStart(4, '0');

        headerContenedor.classList.add("card__pokemon__header");
        contendorBtnFavorite.classList.add("card__header__favorite");
        btnFavorite.classList.add("agregarFavorito");

        contenedorID.classList.add("card__header__numPokemon");
        pokemonID.classList.add("pokemonID");

        pokemonID.appendChild(imgPokeBall);
        pokemonID.appendChild(numID);

        contendorBtnFavorite.appendChild(btnFavorite);
        contendorBtnFavorite.appendChild(btnAcompanante);
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
            electric: 'eléctrico',
            grass: 'planta',
            ice: 'hielo',
            fighting: 'pelea',
            poison: 'veneno',
            ground: 'tierra',
            flying: 'volador',
            psychic: 'psíquico',
            bug: 'bicho',
            rock: 'roca',
            ghost: 'fantasma',
            dragon: 'dragón',
            dark: 'oscuro',
            steel: 'acero',
            fairy: 'hada',
        };

        const cardContenedorInformacion = document.createElement('div');
        const pokeNombre = document.createElement('h3');
        const contenedorPokeTipo = document.createElement('div');
        const btnDetalles = document.createElement('button');
        btnDetalles.innerText = "Más Detalles";

        contenedorPokeTipo.innerHTML = "";

        pokemon.tipo.forEach(tipo => {
            let type = tipo.toLowerCase();
            const h5 = document.createElement('h5');
            h5.style.backgroundColor = coloresTipos[type];
            h5.classList.add('pokemonTipo');
            h5.innerText = tipoEsp[type] || type;
            contenedorPokeTipo.appendChild(h5);
        });

        pokeNombre.classList.add("pokemonNombre");
        pokeNombre.innerText = pokemon.nombre;
        contenedorPokeTipo.classList.add("pokemonTipoList");
        btnDetalles.classList.add("btnDetalles");

        btnDetalles.addEventListener('click', () => {
            showPokemonDetails(pokemon.id);
        });

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

        const card = document.createElement('div');
        card.classList.add("card__pokemon");

        card.appendChild(this.#generarHeaderCard(pokemon));
        card.appendChild(this.#generarPokemonImage(pokemon));
        card.appendChild(this.#generarInformacionGeneral(pokemon));
        card.style.backgroundImage = `url('../Recursos/pokeball.svg'), linear-gradient(to top, ${coloresTipos[pokemon.tipo[0]]}, #010215, #010215)`;

        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(0.95)";
            card.style.borderColor = coloresTipos[pokemon.tipo[0]];
            card.style.boxShadow = `
                                0 0 10px ${coloresTipos[pokemon.tipo[0]]},
                                0 0 20px ${coloresTipos[pokemon.tipo[0]]},
                                0 0 30px ${coloresTipos[pokemon.tipo[0]]}`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
            card.style.borderColor = "white";
            card.style.boxShadow = "2px 2px 1px rgba(53, 51, 51, 0.6)";
        });

        return card;
    }

    dibujarPokedex() {
        const container = document.getElementById("data-pokemons");
        container.innerHTML = "";

        this.#pokemons.forEach(pokemon => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");
            col.style = "padding: 10px";
            col.appendChild(this.#dibujarPokemon(pokemon));
            container.appendChild(col);
        });
    }

    obtenerTodos() {
        return this.#pokemons;
    }

    dibujarPokemonsFiltrados(lista) {
        const container = document.getElementById("data-pokemons");
        container.innerHTML = "";
        lista.forEach(pokemon => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");
            col.style = "padding: 10px";
            col.appendChild(this.#dibujarPokemon(pokemon));
            container.appendChild(col);
        });
    }
}