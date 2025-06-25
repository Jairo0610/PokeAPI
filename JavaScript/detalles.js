import { getPokeJSON } from './data.js';


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
