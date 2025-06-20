import { obtenerAcompanantesDB, obtenerEntrenadoresDB, eliminarAcompananteDB } from './db.js';
import { getPokeJSON } from './data.js';

export async function agregarAcompananteIndexed(pokemonId) {
    // Guardar el ID en el dataset del botón para usarlo después
    const botonConfirmar = document.getElementById("confirmarAsignacion");
    botonConfirmar.dataset.pokemonId = pokemonId;

    // Llenar select de entrenadores
    const select = document.getElementById("selectEntrenador");
    select.innerHTML = "";

    const entrenadores = await obtenerEntrenadoresDB();
    entrenadores.forEach(e => {
        const option = document.createElement("option");
        option.value = e.nombre;
        option.textContent = e.nombre;
        select.appendChild(option);
    });

    // Limpiar tabla anterior
    const tablaContainer = document.getElementById("tablaAcompanantesContainer");
    tablaContainer.innerHTML = "";

    // Cargar acompañantes y pokemones
    const acompanantes = await obtenerAcompanantesDB();
    const pokemones = await getPokeJSON();

    if (acompanantes.length === 0) {
        tablaContainer.innerHTML = `<p class="text-warning text-center">No hay pokémones acompañantes registrados aún.</p>`;
    } else {
        const tablaHTML = `
            <h5 class="text-center mt-4 mb-3">Pokémones acompañantes asignados</h5>
            <table class="table table-dark table-bordered text-center align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Imagen</th>
                        <th>Entrenador</th>
                    </tr>
                </thead>
                <tbody>
                    ${acompanantes.map(acomp => {
                        const poke = pokemones.find(p => p.id === acomp.pokemonId);
                        return `
                            <tr>
                                <td>${poke.id}</td>
                                <td>${poke.nombre}</td>
                                <td><img src="${poke.sprites}" style="height: 50px;"></td>
                                <td>
                                    <select class="form-select text-dark select-entrenador" data-id="${acomp.id}">
                                        ${entrenadores.map(ent => `
                                            <option value="${ent.nombre}" ${ent.nombre === acomp.entrenador ? 'selected' : ''}>${ent.nombre}</option>
                                        `).join('')}
                                    </select>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        tablaContainer.innerHTML = tablaHTML;

        // Agregar event listeners a los select para cambios (igual que antes)
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
    }

    // Mostrar modal
    const modalDiv = document.getElementById("modalSeleccionEntrenador");
    modalDiv.removeAttribute("inert");
    const modal = new bootstrap.Modal(modalDiv);
    modal.show();
}
