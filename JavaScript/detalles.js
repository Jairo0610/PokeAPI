// crear un modal para mostrar los detalles faltantes de los pokemones
export function showPokemonDetails(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(pokemon => {
            const pokemonModalLabel = document.getElementById("pokemonModalLabel");
            const pokemonDetails = document.getElementById("pokemonDetails");

            pokemonModalLabel.textContent = pokemon.name.toUpperCase();

            const types = pokemon.types.map(t => t.type.name).join(', ');
            const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');
            const stats = pokemon.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('');
            const moves = pokemon.moves.slice(0, 5).map(m => `<li>${m.move.name}</li>`).join('');

            pokemonDetails.innerHTML = `
        <div class="text-center">
          <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="img-fluid mb-3" style="max-height: 200px;">
        </div>

        <div class="mb-3 text-center">
          <button id="btnInfo" class="btn btn-info me-2">Información General</button>
          <button id="btnStats" class="btn btn-primary me-2">Estadísticas</button>
          <button id="btnMoves" class="btn btn-secondary">Movimientos</button>
        </div>

        <div id="infoSection">
          <p><strong>Tipo:</strong> ${types}</p>
          <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
          <p><strong>Habilidades:</strong> ${abilities}</p>
        </div>

        <div id="statsSection" style="display: none;">
          <h5>Estadísticas</h5>
          <ul>${stats}</ul>
        </div>

        <div id="movesSection" style="display: none;">
          <h5>Movimientos principales</h5>
          <ul>${moves}</ul>
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
                infoSection.style.display = 'block';
                statsSection.style.display = 'none';
                movesSection.style.display = 'none';
            });

            btnStats.addEventListener('click', () => {
                infoSection.style.display = 'none';
                statsSection.style.display = 'block';
                movesSection.style.display = 'none';
            });

            btnMoves.addEventListener('click', () => {
                infoSection.style.display = 'none';
                statsSection.style.display = 'none';
                movesSection.style.display = 'block';
            });

            // Mostrar modal
            document.getElementById("modal-detalles").style.display = "block";
        });
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
