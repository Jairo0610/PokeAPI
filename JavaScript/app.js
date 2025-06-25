/*--------------------------yanira--------a*/
import {
    addOrUpdateTrainer,
    getAllTrainers,
} from './dbService.js';

// Datos de 5 entrenadores
const trainersData = [
    {
        id: 1,
        code: "AA23027",
        name: "Jairo Argueta",
        avatar: "../Recursos/AvatarJairo.png",
        hobby: "Limpia PC's"
    },
    {
        id: 2,
        code: "CM23015",
        name: "Fatima Cruz",
        avatar: "../Recursos/AvatarFatima.png",
        hobby: "Ama jugar Genshin"
    },
    {
        id: 3,
        code: "GB23003",
        name: "Victor Gonzales",
        avatar: "../Recursos/AvatarVictor.png",
        hobby: "Fan de HDP"
    },
    {
        id: 4,
        code: "CB23001",
        name: "Javier Colocho",
        avatar: "../Recursos/AvatarJavier.png",
        hobby: "Arma PC's"
    },
    {
        id: 5,
        code: "MA22013",
        name: "Yanira Martinez",
        avatar: "../Recursos/AvatarYanira.png",
        hobby: "La guitarra es su amiga"
    }
];

// IIFE que “siembra” IndexedDB en la primera carga
(async () => {
    const existing = await getAllTrainers();
    if (existing.length === 0) {
        await Promise.all(trainersData.map(t => addOrUpdateTrainer(t)));
    }
})();


let pokedex;

let showingFavorites = false;
/*------------------------yanira--------------c*/


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




        //ícono favorito
        btnFavorite.innerHTML = esFavorito(pokemon.id)
            ? "<i class='bx bxs-heart' style='color:#e74c3c'></i>"
            : "<i class='bx bx-heart' style='color:#ffffff'></i>";

        btnFavorite.addEventListener("click", () => {
            alternarFavorito(pokemon.id);
            btnFavorite.innerHTML = esFavorito(pokemon.id)
                ? "<i class='bx bxs-heart' style='color:#e74c3c'></i>"
                : "<i class='bx bx-heart' style='color:#ffffff'></i>";
        });

        numID.textContent = pokemon.id.toString().padStart(4, '0');

        // Clases
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

        // Mostrar detalles al hacer clic
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


        //Cargar los datos y mostrarlas en el frond
        const card = document.createElement('div');
        card.classList.add("card__pokemon");

        card.appendChild(this.#generarHeaderCard(pokemon));
        card.appendChild(this.#generarPokemonImage(pokemon));
        card.appendChild(this.#generarInformacionGeneral(pokemon));
        card.style.backgroundImage = `url('../Recursos/pokeball.svg'), linear-gradient(to top, ${coloresTipos[pokemon.tipo[0]]}, #010215, #010215)`;

        //diseño de cartas con bordes brillosos
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
            col.style = "padding: 10px"
            col.appendChild(this.#dibujarPokemon(pokemon))
            container.appendChild(col);
        })


    }

    //metodos para favoritos
    // Devuelve todos los pokemones (getter público)
    obtenerTodos() {
        return this.#pokemons;
    }

    // Permite dibujar una lista filtrada
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

// jairo

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

//Retorna el color del progress dependiendo del nombre de stast
function colorProgress(nameStats) {
    if (nameStats == "HP") {
        return "#038803"
    }
    else if (nameStats == "ATTACK") {
        return "#d21f08"
    }
    else if (nameStats == "DEFENSE") {
        return "#007bff"
    }
    else if (nameStats == "SPECIAL-ATTACK") {
        return "#fd7e14"
    }
    else if (nameStats == "SPECIAL-DEFENSE") {
        return "#17a2b8"
    }
    else if (nameStats == "SPEED") {
        return "#ffc107"
    }
}


/*------------------------yanira--------------a*/
/**
 * Oculta todas las secciones: entrenadores, acompañantes y Poké–Dex.
 */
function hideAllSections() {
    document.getElementById('entrenadores').style.display = 'none';
    document.getElementById('mis-acompanantes').style.display = 'none';
    document.getElementById('pokedex-container').style.display = 'none';
}


// --- funciones para cambiar de vista ---
function showFavorites() {
    hideAllSections();

    // 0) Muestro el buscador en la vista de Poké–Dex Favoritos
    document.getElementById('buscador-container').style.display = 'block';

    showingFavorites = true;
    document.getElementById('pokedex-container').style.display = 'block';

    const favoritos = obtenerFavoritos();
    const filtrados = pokedex.obtenerTodos().filter(p => favoritos.includes(p.id));
    const mensajeVacio = document.getElementById('mensaje-vacio');
    if (filtrados.length === 0) {
        mensajeVacio.style.display = 'block';
        document.getElementById('data-pokemons').innerHTML = '';
    } else {
        mensajeVacio.style.display = 'none';
        pokedex.dibujarPokemonsFiltrados(filtrados);
    }
}

function showAll() {
    hideAllSections();

    // 0) Muestro el buscador en la vista de Poké–Dex completa
    document.getElementById('buscador-container').style.display = 'block';

    showingFavorites = false;
    document.getElementById('mensaje-vacio').style.display = 'none';
    document.getElementById('pokedex-container').style.display = 'block';
    pokedex.dibujarPokedex();
}

// ————————————————————————————————


/**
 * Muestra solo la sección de entrenadores,
 * ocultando Pokémon y acompañantes.
 */
async function showTrainers() {
    hideAllSections();

    // 0) Oculto el buscador al entrar a entrenadores
    document.getElementById('buscador-container').style.display = 'none';
    hideAllSections();

    // ——— 2.1) Limpia trainers que tengan un favoritePokemonId ya no en favoritos ———
    const favoritosIds = obtenerFavoritos();
    const allTrainers = await getAllTrainers();
    await Promise.all(
        allTrainers
            .filter(t => t.favoritePokemonId && !favoritosIds.includes(t.favoritePokemonId))
            .map(t => {
                t.favoritePokemonId = null;
                return addOrUpdateTrainer(t);
            })
    );

    // ——— 2.2) Renderiza ahora con datos limpios ———
    await renderTrainerCards();

    document.getElementById('entrenadores').style.display = 'block';
}




let datosGlobales, trainersContainer;

async function renderTrainerCards() {
    const trainersFromDB = await getAllTrainers();
    const favoritosIds = obtenerFavoritos();                                   // [4,12,…]
    const assignedIds = trainersFromDB.map(t => t.favoritePokemonId).filter(Boolean);
    const favoritosDatos = datosGlobales.filter(p => favoritosIds.includes(p.id));

    trainersContainer.innerHTML = trainersFromDB.map(t => {
        const assigned = favoritosDatos.find(p => p.id === t.favoritePokemonId);
        const opciones = favoritosDatos.filter(p =>
            p.id === t.favoritePokemonId || !assignedIds.includes(p.id)
        );

        return `
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 d-flex">
            <div class="trainer-card flex-fill">
            <img src="${t.avatar}" class="trainer-avatar" alt="${t.name}">
            <h3 class="trainer-name">${t.name}</h3>
            <p class="trainer-code">Código: ${t.code}</p>
            <p class="trainer-hobby">${t.hobby}</p>

            <label for="fav-${t.id}">Pokémon acompañante:</label>
            <select id="fav-${t.id}" class="favorite-select" data-trainer-id="${t.id}">
                <option value="">— ninguno —</option>
                ${opciones.map(p => `
                <option value="${p.id}" ${p.id === t.favoritePokemonId ? 'selected' : ''}>
                    ${p.nombre.toUpperCase()}
                </option>`).join('')}
            </select>

            ${assigned ? `
                <img src="${assigned.sprites}" class="favorite-pokemon-img"
                    alt="Pokémon de ${t.name}">`
                : ``}
            </div>
        </div>`;
    }).join('');

    // Reengancha los listeners
    document.querySelectorAll('.favorite-select')
        .forEach(sel => sel.addEventListener('change', onTrainerFavoriteChange));
}





window.addEventListener("DOMContentLoaded", async () => {
    // ————— 0) Inicializa referencias y datos globales —————
    trainersContainer = document.getElementById("trainers-container");
    datosGlobales = await getPokeJSON();

    // ————— 1) Carga y render de la PokéDex —————
    pokedex = new Pokedex();
    pokedex.cargarDatosPokemons(datosGlobales);
    pokedex.dibujarPokedex();

    // ————— 2) Render inicial de las cards de entrenadores —————
    renderTrainerCards();

    // ————— 3) Tus listeners existentes —————
    document.getElementById("btnMostrarEntrenadores")
        .addEventListener("click", showTrainers);
    document.getElementById("btnMostrarFavoritos")
        .addEventListener("click", showFavorites);
    document.getElementById("btnMostrarTodos")
        .addEventListener("click", showAll);

    // ————— Buscador —————
    const buscador = document.getElementById("buscador");

    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase().trim();

        // 1) Base sobre la que buscamos: todos o solo favoritos
        let base;
        if (showingFavorites) {
            const favIds = obtenerFavoritos();  // array de IDs favoritos
            base = pokedex.obtenerTodos().filter(p => favIds.includes(p.id));
        } else {
            base = pokedex.obtenerTodos();
        }

        // 2) Filtrado por nombre
        const filtrados = base.filter(p => p.nombre.toLowerCase().includes(texto));
        const mensajeVacio = document.getElementById("mensaje-vacio");

        if (filtrados.length === 0) {
            mensajeVacio.style.display = "block";
            mensajeVacio.textContent = showingFavorites
                ? "No se encontraron favoritos con ese criterio."
                : "No se encontraron pokemones con ese criterio.";
            document.getElementById("data-pokemons").innerHTML = "";
        } else {
            mensajeVacio.style.display = "none";
            pokedex.dibujarPokemonsFiltrados(filtrados);
        }
    });


});



async function showPokemonDetails(id) {
    const pokemons = await getPokeJSON();
    const pokemon = pokemons.find(p => p.id === id);
    
    if (!pokemon) {
        console.error(`No se encontró el Pokémon con ID ${id}`);
        return;
    }

    const pokemonModalLabel = document.getElementById("pokemonModalLabel");
    const pokemonDetails = document.getElementById("pokemonDetails");
    pokemonModalLabel.textContent = pokemon.nombre.toUpperCase();

    let tipo = ``
    await pokemon.tipo.forEach(t => {
        tipo += `<h4 class = "pokemonTipo fs-4" style="background-color: ${coloresTipos[t]}">${tipoEsp[t].toUpperCase()}</h4>`
    });
    let debilidades = ``
    await pokemon.debilidades.forEach(d => {
        debilidades += `<h4 class = "pokemonTipo  fs-4 fw-semibold" style="background-color: ${coloresTipos[d]}">${tipoEsp[d].toUpperCase()}</h4>`
    });


    const abilities = pokemon.habilidades.map(h => `
        <div class="col-md-6">
        <div class="card mb-2 shadow-sm border-0">
            <div class="card-body d-flex justify-content-between align-items-center">
            <span class="text-capitalize fw-semibold">${h}</span>
            <span class="badge bg-success text-uppercase">Skill</span>
            </div>
        </div>
        </div>
    `).join('');



    const stats = pokemon.stats.map(s => `
            <div class="p-2">
                <h5 class="fw-medium  fs-5">${s.nombre.toUpperCase()}</h5>
                <div class="progress" role="progressbar" aria-label="Barra de progreso" aria-valuemin="0" aria-valuemax="255" style="height: 25px; background-color: #ffffff00;">
                    <div class="progress-bar fw-medium fs-5 fw-semibold" style="width: ${(s.valor / 255) * 100}%; background-color: ${coloresTipos[pokemon.tipo[0]]}; color: black">
                        ${s.valor}
                    </div>
                </div>
            </div>`).join('');

    const moves = pokemon.moves.map(m => `
    <div class="col-md-6 col-lg-4">
        <div class="card mb-3 shadow-sm border-0">
        <div class="card-body d-flex justify-content-between align-items-center">
            <span class="text-capitalize fw-semibold">${m}</span>
            <span class="badge bg-primary text-uppercase">Move</span>
        </div>
        </div>
    </div>
    `).join('');

    pokemonDetails.innerHTML = `
        <div class="text-center">
            <img src="${pokemon.sprites}" class="pokemonImagen img-fluid mb-3 " style="max-height: 200px;">
        </div>

        <ul class="nav nav-pills nav-fill ">
        <li class="nav-item">
            <button id="btnInfo" class="btn active btn-primary me-2" >Información General</button>
        </li>
        <li class="nav-item">
            <button id="btnStats" class="btn me-2">Estadísticas</button>
        </li>
        <li class="nav-item">
            <button id="btnMoves" class="btn">Movimientos</button>
        </li>
        </ul>

        <div id="infoSection" class="row g-3 justify-content-around ">
            <div class="col-md-6">
                <h5 class="text-center mt-3 fw-bold">Tipo</h5>
                <div class="d-flex flex-wrap justify-content-around fw-semibold">${tipo}</div>

                <h5 class="text-center mt-4 fw-bold">Altura</h5>
                <div class="d-flex justify-content-center">
                <p class="badge fs-4 fw-semibold" style="background-color: #1c1f3f;">
                    ${pokemon.altura.toUpperCase()}
                </p>
                </div>

                <h5 class="text-center mt-4 fw-bold">Peso</h5>
                <div class="d-flex justify-content-center">
                <p class="badge fs-4 fw-semibold" style="background-color: #1c1f3f;">
                    ${pokemon.peso.toUpperCase()}
                </p>
                </div>
            </div>

            <div class="col-md-6">
                <h5 class="text-center  mt-3 fw-bold">Habilidades</h5>
                <div class="row">
                ${abilities}
                </div>

                <h5 class="text-center mt-4 fw-bold">Debilidades</h5>
                <div class="d-flex flex-wrap justify-content-around">${debilidades}</div>
            </div>
        </div>

        <div id="statsSection" class="row justify-content-around " style="display: none;">
            <div class="col-md-12">
                <div class="vstack gap-3">${stats}</div>
            </div>
        </div>

        <div id="movesSection" class="row justify-content-around" style="display: none;">
        <div class="col-md-12">
            <h5 class="text-center tfw-medium mt-3 fw-bold">Movimientos principales</h5>
            <div class="row">
            ${moves}
            </div>
        </div>
        </div>
        `;

    // Manejo de secciones
    const btnInfo = document.getElementById('btnInfo');
    const btnStats = document.getElementById('btnStats');
    const btnMoves = document.getElementById('btnMoves');
    const infoSection = document.getElementById('infoSection');
    const statsSection = document.getElementById('statsSection');
    const movesSection = document.getElementById('movesSection');

    btnInfo.addEventListener('click', () => {
        infoSection.style.display = 'flex';
        btnInfo.classList.add('active');
        btnInfo.classList.add('btn-primary');
        statsSection.style.display = 'none';
        btnStats.classList.remove('active');
        btnStats.classList.remove('btn-primary');
        movesSection.style.display = 'none';
        btnMoves.classList.remove('active');
        btnMoves.classList.remove('btn-primary');
    });

    btnStats.addEventListener('click', () => {
        infoSection.style.display = 'none';
        btnInfo.classList.remove('active');
        btnInfo.classList.remove('btn-primary');
        statsSection.style.display = 'flex';
        btnStats.classList.add('active');
        btnStats.classList.add('btn-primary');
        movesSection.style.display = 'none';
        btnMoves.classList.remove('active');
        btnMoves.classList.remove('btn-primary');
    });

    btnMoves.addEventListener('click', () => {
        infoSection.style.display = 'none';
        btnInfo.classList.remove('active');
        btnInfo.classList.remove('btn-primary');
        statsSection.style.display = 'none';
        btnStats.classList.remove('active');
        btnStats.classList.remove('btn-primary');
        movesSection.style.display = 'flex';
        btnMoves.classList.add('active');
        btnMoves.classList.add('btn-primary');
    });

    // Mostrar modal
    document.getElementById("modal-detalles").style.display = "block";
}

// Cerrar modal
document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-detalles").style.display = "none";
});

window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal-detalles");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


//funciones globales para los favoritos

function obtenerFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function guardarFavoritos(favoritos) {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function esFavorito(id) {
    const favoritos = obtenerFavoritos();
    return favoritos.includes(id);
}

/*------------------------yanira--------------a*/
async function alternarFavorito(id) {
    const favoritos = obtenerFavoritos();

    if (favoritos.includes(id)) {
        // Si ya estaba, lo quitamos
        const nuevos = favoritos.filter(fav => fav !== id);
        guardarFavoritos(nuevos);

        // Además, elimina de Listeners cualquier trainer que tuviera este id
        const all = await getAllTrainers();
        await Promise.all(
            all
                .filter(t => t.favoritePokemonId === id)
                .map(async t => {
                    t.favoritePokemonId = null;
                    await addOrUpdateTrainer(t);
                })
        );

        //return;
    } else {

        // Si no estaba y ya hay 6, no añadimos
        if (favoritos.length >= 6) {
            showLimitAlert("❌ Solo puedes tener hasta 6 Pokémon favoritos.");
            return;
        }

        // Si queda espacio, lo añadimos
        favoritos.push(id);
        guardarFavoritos(favoritos);

    }

    // refresca vistas
    if (document.getElementById('entrenadores').style.display !== 'none') {
        await renderTrainerCards();
    }

    if (showingFavorites) {

        showFavorites();
    }
}


/**
 * Muestra una alerta Bootstrap de modo temporal (5s).
 */
function showLimitAlert(message) {
    const placeholder = document.getElementById('limit-alert-placeholder');
    // Inyecta la alerta
    placeholder.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>`;
    // La removeremos tras 5 segundos
    setTimeout(() => {
        // Inicia el fade out
        const alertEl = placeholder.querySelector('.alert');
        if (alertEl) {
            alertEl.classList.remove('show');
            alertEl.classList.add('hide');
            // Luego la limpiamos del DOM
            setTimeout(() => placeholder.innerHTML = '', 500);
        }
    }, 5000);
}


async function onTrainerFavoriteChange(e) {
    const trainerId = Number(e.target.dataset.trainerId);
    const pokemonId = e.target.value === "" ? null : Number(e.target.value);

    // 1) Lee, actualiza y guarda SOLO en el store 'trainers'
    const all = await getAllTrainers();
    const trainer = all.find(t => t.id === trainerId);
    trainer.favoritePokemonId = pokemonId;        // asigna, cambia o borra (null)
    await addOrUpdateTrainer(trainer);

    // 2) Refresca la UI
    renderTrainerCards();
}


/*------------------------yanira----------------------c*/
