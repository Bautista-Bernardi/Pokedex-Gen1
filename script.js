
// 1. DIRECCION DE LA API

const URL_API = "https://pokeapi.co/api/v2/pokemon";

// 2. CONECTAR JAVASCRIPT CON HTML

const contenedor = document.getElementById("contenedorPokemon");
const buscador = document.getElementById("buscador");
const filtroTipo = document.getElementById("filtroTipo");
const mensaje = document.getElementById("mensaje");

// 3. GUARDAR LOS POKEMON

let listaPokemon = [];


// 4. FUNCION PARA CONSULTAR LA API

async function obtenerPokemon() {

    mensaje.textContent = "Cargando Pokémon...";

    try {

        // Hacer una consulta a la API
        const respuesta = await fetch(`${URL_API}?limit=20`);

        // Comprobar si la respuesta fue exitosa
        if (!respuesta.ok) {
            throw new Error("Error al consultar la API");
        }

        // Convertir la respuesta a JSON
        const datos = await respuesta.json();

        // Consultar los detalles de cada Pokémon
        const promesas = datos.results.map(async (pokemon) => {

            const respuestaPokemon = await fetch(pokemon.url);

            if (!respuestaPokemon.ok) {
                throw new Error("Error al obtener un Pokémon");
            }

            return await respuestaPokemon.json();

        });

        // Esperar que terminen todas las consultas
        listaPokemon = await Promise.all(promesas);

        // Mostrar los Pokémon
        mostrarPokemon(listaPokemon);

    } catch (error) {

        // Mostrar errores
        mensaje.textContent = "No se pudieron cargar los Pokémon.";

        console.error(error);

    } finally {

        // Se ejecuta siempre
        console.log("Consulta finalizada");

    }
}


// 5. FUNCION PARA MOSTRAR LAS TARJETAS

function mostrarPokemon(pokemon) {

    contenedor.innerHTML = "";

    if (pokemon.length === 0) {
        mensaje.textContent = "No se encontraron Pokémon.";
        return;
    }

    mensaje.textContent = `Se encontraron ${pokemon.length} Pokémon.`;

    pokemon.forEach(item => {

        const tipos = item.types.map(t => t.type.name);

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("card");

        tarjeta.innerHTML = `
            <img src="${item.sprites.front_default}"
                 alt="${item.name}">

            <h2>${item.name}</h2>

            <p>Número: ${item.id}</p>

            <p>Altura: ${item.height / 10} m</p>

            <p>Peso: ${item.weight / 10} kg</p>

            <div>
                ${tipos.map(tipo =>
                    `<span class="tipo">${tipo}</span>`
                ).join("")}
            </div>
        `;

        contenedor.appendChild(tarjeta);

    });

}


// 6. FUNCION PARA FILTRAR LOS POKEMON

function filtrarPokemon() {

    const nombre = buscador.value.toLowerCase().trim();

    const tipoSeleccionado = filtroTipo.value;

    const resultado = listaPokemon.filter(pokemon => {

        const coincideNombre = pokemon.name.includes(nombre);

        const coincideTipo =
            tipoSeleccionado === "" ||
            pokemon.types.some(t =>
                t.type.name === tipoSeleccionado
            );

        return coincideNombre && coincideTipo;

    });

    mostrarPokemon(resultado);

}


// 7. DETECTAR LOS CAMBIOS DEL USUARIO

buscador.addEventListener("input", filtrarPokemon);

filtroTipo.addEventListener("change", filtrarPokemon);


// 8. INICIAR LA APLICACION

obtenerPokemon();
