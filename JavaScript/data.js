// Función para cargar archivo JSON de pokemones
export async function getPokeJSON() {
    const response = await fetch('https://jairo0610.github.io/PokeAPI/JavaScript/dataPokemon.json');
    if (!response.ok) throw new Error('Error al cargar pokemons.json');
    const data = await response.json();
    return data;
}

// Funciones para manejo de favoritos con localStorage
export function obtenerFavoritos() {
    const fav = localStorage.getItem("favoritos");
    if (fav) return JSON.parse(fav);
    return [];
}

export function esFavorito(id) {
    return obtenerFavoritos().includes(id);
}

export function alternarFavorito(id) {
    let favoritos = obtenerFavoritos();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(fav => fav !== id);
    } else {
        favoritos.push(id);
    }
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}