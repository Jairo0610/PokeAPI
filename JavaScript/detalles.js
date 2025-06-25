import { getPokeJSON } from './data.js';

// import { coloresTipos } from './colores.js';

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


// crear un modal para mostrar los detalles faltantes de los pokemones
export async function showPokemonDetails(id) {
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


export function cerrarModalDetalles() {
  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-detalles").style.display = "none";
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal-detalles");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}
