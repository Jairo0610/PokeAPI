// dbService.js
const DB_NAME    = 'PokeAPI';
const DB_VERSION = 1;
const STORE_NAME = 'trainers';

/**
 * Abre (o actualiza) la base de datos y devuelve la instancia.
 */
export function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      // Si no existe el store trainers, lo creamos
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',      // usaremos id numérico o string como PK
          autoIncrement: false
        });
        store.createIndex('name', 'name', { unique: false });
      }
    };
  });
}

/**
 * Inserta (o reemplaza) un entrenador.
 * @param {{id:number,name:string,avatar:string,hobby:string,code:string}} trainer
 */
export async function addOrUpdateTrainer(trainer) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(trainer);
  return tx.done;
}

/** Devuelve todos los entrenadores del store. */
export async function getAllTrainers() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

/** Borra un entrenador según su id. */
export async function removeTrainer(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
  return tx.done;
}
