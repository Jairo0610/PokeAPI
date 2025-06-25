
import { obtenerFavoritos } from './data.js';
import { obtenerAcompanantesDB, obtenerEntrenadoresDB, eliminarAcompananteDB, agregarAcompanante } from './db.js';
import { getPokeJSON } from './data.js';
import { Pokedex } from './pokedex.js';

export function configurarEventos(pokedex) {
    // Botón mostrar favoritos
    document.getElementById("btnMostrarFavoritos").addEventListener("click", () => {
        document.getElementById("btnMostrarFavoritos").classList.add("active");
        document.getElementById("btnMostrarAcompanantes").classList.remove("active");
        document.getElementById("btnMostrarTodos").classList.remove("active");

        const favoritos = obtenerFavoritos();
        const todos = pokedex.obtenerTodos();
        const filtrados = todos.filter(p => favoritos.includes(p.id));
        const mensajeVacio = document.getElementById("mensaje-vacio");

        document.getElementById("tablaAcompanantesContainer").innerHTML = "";

        if (filtrados.length === 0) {
            mensajeVacio.style.display = "block";
            mensajeVacio.textContent = "Aún no tienes pokemones favoritos.";
            document.getElementById("data-pokemons").innerHTML = "";
        } else {
            mensajeVacio.style.display = "none";
            pokedex.dibujarPokemonsFiltrados(filtrados);
        }
    });

    // Botón mostrar acompañantes
    document.getElementById("btnMostrarAcompanantes").addEventListener("click", async () => {
        const acompanantes = await obtenerAcompanantesDB();
        const todos = pokedex.obtenerTodos();
        const filtrados = todos.filter(p => acompanantes.some(a => a.pokemonId === p.id));
        const mensajeVacio = document.getElementById("mensaje-vacio");

        if (filtrados.length === 0) {
            mensajeVacio.style.display = "block";
            mensajeVacio.textContent = "Aún no tienes pokémones acompañantes.";
            document.getElementById("data-pokemons").innerHTML = "";
            document.getElementById("tablaAcompanantesContainer").innerHTML = "";
        } else {
            mensajeVacio.style.display = "none";
            pokedex.dibujarPokemonsFiltrados(filtrados);

            // Tabla de entrenadores debajo de las cartas
            const entrenadores = await obtenerEntrenadoresDB();
            const tablaHTML = `
                <h5 class="text-center mt-4 mb-3">Pokémones acompañantes asignados</h5>
                <div class="table-responsive">
                    <table class="table table-dark table-bordered text-center align-middle">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Imagen</th>
                        <th>Entrenador</th>
                        <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${acompanantes.map(acomp => {
                const poke = todos.find(p => p.id === acomp.pokemonId);
                return `
                            <tr>
                            <td>${poke.id}</td>
                            <td>${poke.nombre}</td>
                            <td><img src="${poke.sprites}" style="height: 50px;"></td>
                            <td>
                                <select class="form-select text-dark select-entrenador" data-id="${acomp.id}">
                                ${entrenadores.map(ent => `
                                    <option value="${ent.nombre}" ${ent.nombre === acomp.entrenador ? 'selected' : ''}>
                                    ${ent.nombre}
                                    </option>
                                `).join('')}
                                </select>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-eliminar" data-id="${acomp.id}">Eliminar</button>
                            </td>
                            </tr>
                        `;
            }).join('')}
                    </tbody>
                    </table>
                </div>
                `;

            document.getElementById("tablaAcompanantesContainer").innerHTML = tablaHTML;

            // cambios en los select
            document.querySelectorAll(".select-entrenador").forEach(select => {
                select.addEventListener("change", async (e) => {
                    const id = Number(e.target.getAttribute("data-id"));
                    const nuevoEntrenador = e.target.value;
                    const tx = db.transaction("acompanantes", "readwrite");
                    const store = tx.objectStore("acompanantes");
                    const req = store.get(id);
                    req.onsuccess = () => {
                        const obj = req.result;
                        obj.entrenador = nuevoEntrenador;
                        store.put(obj);
                    };
                });
            });

            // **Aquí el listener para eliminar**
            document.querySelectorAll(".btn-eliminar").forEach(button => {
                button.addEventListener("click", async e => {
                    const id = Number(e.target.getAttribute("data-id"));
                    if (confirm("¿Seguro que quieres eliminar este pokémon acompañante?")) {
                        try {
                            await eliminarAcompananteDB(id);
                            alert("Acompañante eliminado.");

                            // Recargar la pokedex y tabla para reflejar cambios
                            const datos = await getPokeJSON();
                            const nuevaPokedex = new Pokedex();
                            nuevaPokedex.cargarDatosPokemons(datos);
                            await nuevaPokedex.cargarAcompanantes();
                            nuevaPokedex.dibujarPokedex();

                            // Refrescar tabla acompañantes
                            document.getElementById("btnMostrarAcompanantes").click();

                        } catch (error) {
                            alert("Error al eliminar acompañante: " + error);
                        }
                    }
                });
            });
        }
    });

    // Botón mostrar todos
    document.getElementById("btnMostrarTodos").addEventListener("click", () => {
        document.getElementById("mensaje-vacio").style.display = "none";
        document.getElementById("tablaAcompanantesContainer").innerHTML = "";
        pokedex.dibujarPokedex();
    });

    // Buscador
    const buscador = document.getElementById("buscador");
    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase().trim();
        const todos = pokedex.obtenerTodos();
        const filtrados = todos.filter(pokemon => pokemon.nombre.toLowerCase().includes(texto));

        document.getElementById("tablaAcompanantesContainer").innerHTML = "";
        pokedex.dibujarPokemonsFiltrados(filtrados);
    });

    // Listener para confirmar asignación
    document.getElementById("confirmarAsignacion").addEventListener("click", async () => {
        const botonConfirmar = document.getElementById("confirmarAsignacion");
        const pokemonAAsignar = botonConfirmar.dataset.pokemonId;

        if (!pokemonAAsignar) {
            alert("No hay pokémon seleccionado para asignar.");
            return;
        }

        const entrenador = document.getElementById("selectEntrenador").value;

        if (!entrenador) {
            alert("Selecciona un entrenador válido.");
            return;
        }

        const acompanantesActuales = await obtenerAcompanantesDB();
        if (acompanantesActuales.length >= 6) {
            alert("Solo puedes tener 6 pokemones acompañantes.");
            return;
        }

        await agregarAcompanante(Number(pokemonAAsignar), entrenador);

        const modalInstance = bootstrap.Modal.getInstance(document.getElementById("modalSeleccionEntrenador"));
        modalInstance.hide();

        alert("Acompañante asignado con éxito.");

        const pokedex = new Pokedex();
        const datos = await getPokeJSON();
        pokedex.cargarDatosPokemons(datos);
        await pokedex.cargarAcompanantes();
        pokedex.dibujarPokedex();
    });
}

