// main.js
import { abrirDB } from './db.js';
import { getPokeJSON } from './data.js';
import { Pokedex } from './pokedex.js';
import { configurarEventos } from './eventos.js';
import { cerrarModalDetalles } from './detalles.js';

document.addEventListener("DOMContentLoaded", async () => {
    await abrirDB();

    const datos = await getPokeJSON();
    const pokedex = new Pokedex();
    pokedex.cargarDatosPokemons(datos);
    await pokedex.cargarAcompanantes();
    pokedex.dibujarPokedex();

    cerrarModalDetalles();
    configurarEventos(pokedex);
    
});


