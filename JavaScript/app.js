//función para extraer los datos del archivo JSON creado de la clase pokemon
async function getPokeJSON() {
    try {
        const response = await fetch("../JavaScript/dataPokemon.json");
        const pokemons = await response.json();

        const container = document.getElementById("data-pokemons");
        container.innerHTML = ""; // Limpiar contenido previo

        //Cargar los datos y mostrarlas en el frond
        pokemons.forEach(pokemon => {
            const col = document.createElement("div");
            col.classList.add("col-3");
            col.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.nombre}</h5>
                        <p><strong>ID:</strong> ${pokemon.id}</p>
                        <p><strong>Tipo:</strong> ${pokemon.tipo.join(", ")}</p>
                        <p><strong>Altura:</strong> ${pokemon.altura}</p>
                        <p><strong>Peso:</strong> ${pokemon.peso}</p>
                        <p><strong>Habilidades:</strong> ${pokemon.habilidades.join(", ")}</p>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

    } catch (error) {
        console.error("Error al cargar los pokemons:", error);
    }
}

// Ejecutar cuando la página esté cargada
window.addEventListener("DOMContentLoaded", getPokeJSON);