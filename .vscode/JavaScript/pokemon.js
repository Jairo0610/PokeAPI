class Pokemon {
    constructor(id, nombre, especie, altura, peso, tipo, habilidades, debilidades,stats, moves, sprites){
        this.id = id
        this.nombre = nombre
        this.especie = especie
        this.altura = altura
        this.peso = peso
        this.tipo = tipo
        this.habilidades = habilidades
        this.debilidades = debilidades
        this.stats = stats
        this.moves = moves
        this.sprites = sprites
    }

    //Funcion para extraer los datos de los 150 pokemones
    async getPokeAPI() {
        try {
            let arrayPokemon = new Array()
            for (let id = 1; id < 151; id++) {
                const re = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                const data = await re.json()

                const debResponse = await fetch(data.types[0].type.url)
                const deb = await debResponse.json()
                const debilidades = deb.damage_relations.double_damage_from.map(t => t.name)
                const newPokemon = new Pokemon(
                        data.id,
                        data.name,
                        data.species.name,
                        data.height / 10 + " m",
                        data.weight / 10 + " kg",
                        data.types.map(t => t.type.name),
                        data.abilities.map(h => h.ability.name),
                        debilidades,
                        data.stats.map(stat => ({
                            nombre: stat.stat.name,
                            valor: stat.base_stat
                        })),
                        data.moves.slice(0, 5).map(m => m.move.name),
                        data.sprites.other["official-artwork"].front_default
                    )
                    arrayPokemon.push(newPokemon)
            }
            return arrayPokemon
        } catch (error) {
            console.log(error)
        }
    }
    
}

//Crea un archivo json cargado con datos de los 150 pokemons poporcionados de la pokeAPI
//Ejecutar solo para crear el archivo json o reescribirlo
import fs from 'fs';
const arrayPokemon = await new Pokemon().getPokeAPI()

const data = JSON.stringify(arrayPokemon, null, 4)
fs.writeFileSync("dataPokemon.json", data)