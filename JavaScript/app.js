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
    const isIndex = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    if (isIndex) {
        const containers = document.querySelectorAll(".data-pokemons");
        const indices = [0, 3, 6];

        containers.forEach((container, i) => {
            container.innerHTML = "";

            const pokemonIndex = indices[i];
            if (this.#pokemons[pokemonIndex]) {
                const col = document.createElement("div");
                col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");
                col.style.padding = "10px";
                col.appendChild(this.#dibujarPokemon(this.#pokemons[pokemonIndex]));
                container.appendChild(col);
            }
        });

    } else {
        const container = document.getElementById("data-pokemons");
        container.innerHTML = "";

        this.#pokemons.forEach(pokemon => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");
            col.style.padding = "10px";
            col.appendChild(this.#dibujarPokemon(pokemon));
            container.appendChild(col);
        });
    }
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
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3" , "pokemon-card");
            col.style = "padding: 10px";
            col.appendChild(this.#dibujarPokemon(pokemon));
            container.appendChild(col);

                // Dispara la animación en el siguiente ciclo de render
                requestAnimationFrame(() => {
                    col.classList.add("mostrar");
                });
        });
    }
    



}

window.addEventListener("DOMContentLoaded", async () => {
    const datos = await getPokeJSON();
    const pokedex = new Pokedex();
    pokedex.cargarDatosPokemons(datos);
    pokedex.dibujarPokedex();


    //favoritos
    document.getElementById("btnMostrarFavoritos").addEventListener("click", () => {
        const favoritos = obtenerFavoritos();
        const todos = pokedex.obtenerTodos();
        const filtrados = todos.filter(p => favoritos.includes(p.id));

        const mensajeVacio = document.getElementById("mensaje-vacio");

        if (filtrados.length === 0) {
            mensajeVacio.style.display = "block";
            document.getElementById("data-pokemons").innerHTML = ""; // Limpia
        } else {
            mensajeVacio.style.display = "none";
            pokedex.dibujarPokemonsFiltrados(filtrados);
        }
    });

    // Botón Mostrar Todos
    document.getElementById("btnMostrarTodos").addEventListener("click", () => {
        document.getElementById("mensaje-vacio").style.display = "none";
        pokedex.dibujarPokedex();
    });


    //barra de busqueda
    const buscador = document.getElementById("buscador");

    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase().trim();
        const todos = pokedex.obtenerTodos();

        // Filtrar por nombre 
        const filtrados = todos.filter(pokemon => {
            const nombre = pokemon.nombre.toLowerCase();
            return nombre.includes(texto);
        });

        const mensajeVacio = document.getElementById("mensaje-vacio");

        if (filtrados.length === 0) {
            mensajeVacio.style.display = "block";
            mensajeVacio.textContent = "No se encontraron pokemones con ese criterio.";
            document.getElementById("data-pokemons").innerHTML = "";
        } else {
            mensajeVacio.style.display = "none";
            pokedex.dibujarPokemonsFiltrados(filtrados);
        }
    });



});

//Retorna el color del progress dependiendo del nombre de stast
function colorProgress(nameStats){
    if(nameStats == "HP"){
        return "#038803"
    }
    else if(nameStats == "ATTACK"){
        return "#d21f08"
    }
    else if(nameStats == "DEFENSE"){
        return "#007bff"
    }
    else if(nameStats == "SPECIAL-ATTACK"){
        return "#fd7e14"
    }
    else if(nameStats == "SPECIAL-DEFENSE"){
        return "#17a2b8"
    }
    else if(nameStats == "SPEED"){
        return "#ffc107"
    }
}

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
        tipo += `<h4 class = "pokemonTipo fs-4 font-monospace" style="background-color: ${coloresTipos[t]}">${tipoEsp[t].toUpperCase()}</h4>`
    });
    let debilidades = ``
    await pokemon.debilidades.forEach(d => {
        debilidades += `<h4 class = "pokemonTipo fs-4 font-monospace" style="background-color: ${coloresTipos[d]}">${tipoEsp[d].toUpperCase()}</h4>`
    });
    

    const abilities = pokemon.habilidades.join(', ');
    const stats = pokemon.stats.map(s => `
        <div class="p-2">
            <h5 class="fw-medium font-monospace">${s.nombre.toUpperCase()}</h5>
            <div class="progress" role="progressbar" aria-label="Barra de progreso" aria-valuemin="0" aria-valuemax="255" style="height: 25px; background-color: #ffffff00;">
                <div class="progress-bar progress-bar-striped font-monospace fw-medium fs-5" style="width: ${(s.valor / 255) * 100}%; background-color: ${colorProgress(s.nombre.toUpperCase())};">
                    ${s.valor}
                </div>
            </div>
        </div>`).join('');

    const moves = pokemon.moves.map(m => `<li>${m}</li>`).join('');

    pokemonDetails.innerHTML = `
    <div class="text-center">
        <img src="${pokemon.sprites}" class="img-fluid mb-3" style="max-height: 200px;">
    </div>

    <div class="mb-3 text-center">
        <button id="btnInfo" class="btn btn-info me-2">Información General</button>
        <button id="btnStats" class="btn btn-primary me-2">Estadísticas</button>
        <button id="btnMoves" class="btn btn-secondary">Movimientos</button>
    </div>

    <div id="infoSection" class="row g-3 justify-content-around">
        <div class="col-md-6">
            <h5 class="fw-medium mt-3">Tipo</h5>
            <div class="d-flex flex-wrap justify-content-around">${tipo}</div>

            <h5 class="fw-medium mt-4">Altura</h5>
            <p>${pokemon.altura.toUpperCase()}</p>

            <h5 class="fw-medium mt-4">Peso</h5>
            <p>${pokemon.peso.toUpperCase()}</p>
        </div>

        <div class="col-md-6">
            <h5 class="fw-medium mt-3">Habilidades</h5>
            <p>${abilities.toUpperCase()}</p>

            <h5 class="fw-medium mt-4">Debilidades</h5>
            <div class="d-flex flex-wrap justify-content-around">${debilidades}</div>
        </div>
    </div>

    <div id="statsSection" class="row justify-content-around" style="display: none;">
        <div class="col-md-10">
            <h3>Estadísticas</h3>
            <div class="vstack gap-3">${stats}</div>
        </div>
    </div>

    <div id="movesSection" class="row justify-content-around" style="display: none;">
        <div class="col-md-8">
            <h5>Movimientos principales</h5>
            <ul class="list-unstyled">${moves}</ul>
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
        statsSection.style.display = 'none';
        movesSection.style.display = 'none';
    });

    btnStats.addEventListener('click', () => {
        infoSection.style.display = 'none';
        statsSection.style.display = 'flex';
        movesSection.style.display = 'none';
    });

    btnMoves.addEventListener('click', () => {
        infoSection.style.display = 'none';
        statsSection.style.display = 'none';
        movesSection.style.display = 'flex';
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

function alternarFavorito(id) {
    let favoritos = obtenerFavoritos();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fav => fav !== id);
    } else {
        favoritos.push(id);
    }
    guardarFavoritos(favoritos);
}


