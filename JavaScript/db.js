export let db;

// Función para abrir o crear la base IndexedDB
export function abrirDB() {
    return new Promise((resolve, reject) => {
        const solicitud = indexedDB.open("PokeDB", 1);

        solicitud.onupgradeneeded = (evento) => {
            db = evento.target.result;
            if (!db.objectStoreNames.contains("acompanantes")) {
                const storeAcompanantes = db.createObjectStore("acompanantes", { keyPath: "id", autoIncrement: true });
                storeAcompanantes.createIndex("pokemonId", "pokemonId", { unique: true });
                storeAcompanantes.createIndex("entrenador", "entrenador", { unique: false });
            }
            if (!db.objectStoreNames.contains("entrenadores")) {
                const storeEntrenadores = db.createObjectStore("entrenadores", { keyPath: "id", autoIncrement: true });
                storeEntrenadores.createIndex("nombre", "nombre", { unique: true });
            }
        };

        solicitud.onsuccess = (evento) => {
            db = evento.target.result;
            resolve();
        };

        solicitud.onerror = (evento) => {
            reject(evento.target.error);
        };
    });
}

// CRUD para acompañantes y entrenadores
export async function agregarAcompanante(pokemonId, entrenador) {
    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("acompanantes", "readwrite");
        const store = transaccion.objectStore("acompanantes");
        console.log("Agregando a acompañante:", { pokemonId, entrenador });
        const request = store.add({ pokemonId, entrenador });
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Error al agregar acompañante");
    });
}

export async function eliminarAcompananteDB(id) {
    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("acompanantes", "readwrite");
        const store = transaccion.objectStore("acompanantes");
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Error al eliminar acompañante");
    });
}

export async function obtenerAcompanantesDB() {
    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("acompanantes", "readonly");
        const store = transaccion.objectStore("acompanantes");
        const request = store.getAll();
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = () => reject("Error al obtener acompañantes");
    });
}

export async function obtenerEntrenadoresDB() {
    return new Promise((resolve, reject) => {
        const transaccion = db.transaction("entrenadores", "readonly");
        const store = transaccion.objectStore("entrenadores");
        const request = store.getAll();
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = () => reject("Error al obtener entrenadores");
    });
}

