// Función para obtener las películas favoritas almacenadas en localStorage
function obtenerPeliculasFavoritas() {
    const favorito = JSON.parse(localStorage.getItem('codigoFav')) || [];
    return favorito;
}

// Función para mostrar las películas favoritas en el HTML
async function mostrarPeliculasFavoritas() {
    const peliculasFavoritas = obtenerPeliculasFavoritas();
    const contenedorPeliculasFavoritas = document.getElementById('contenedorPeliculasFavoritas');
    const noHayPeliculasPeliculas = document.getElementById('noHayPeliculas');
    const mensajeError = document.getElementById('mensajeError');


 // Limpiar el contenido actual del contenedor
 contenedorPeliculasFavoritas.innerHTML = '';

 if (peliculasFavoritas.length === 0) {
     // Mostrar mensaje de falta de películas
     noHayPeliculasPeliculas.style.display = 'block';
     mensajeError.style.display = 'none';
 } else {
     try {
         // Mostrar las películas favoritas
         for (const codigo of peliculasFavoritas) {
             const pelicula = await obtenerPeliculaPorCodigo(codigo);

             if (pelicula) {
                 const {
                     poster_path,
                     title,
                     id,
                     original_title,
                     original_language,
                     release_date,
                     overview
                 } = pelicula;

                 const tarjeta = document.createElement('div');
                 tarjeta.classList.add('favorita');
                 tarjeta.innerHTML = `
             <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
             <h3 class="titulo">${title}</h3>
             <p><b>Código:</b> <span class="codigo">${id}</span><br>
             <b>Título original:</b> ${original_title}<br>
             <b>Idioma original:</b> ${original_language}<br>
             <b>Año:</b> ${release_date}<br>
             <b>Resumen:</b> ${overview}<br>
             <button class="button radius medium eliminar-favorita">Quitar de Favoritos</button>`;

             contenedorPeliculasFavoritas.appendChild(tarjeta);
             }
         }

         noHayPeliculasPeliculas.style.display = 'none';
         mensajeError.style.display = 'none';
     } catch (error) {
         // Mostrar mensaje de error
         noHayPeliculasPeliculas.style.display = 'none';
         mensajeError.style.display = 'block';
     }
 }
} 

 async function obtenerPeliculaPorCodigo(codigo) {
    try {
        const apiKey = 'e288061cc427cc58c8fd098e51c15361';
        const language = 'es-ES';
        const url = `https://api.themoviedb.org/3/movie/${codigo}?api_key=${apiKey}&language=${language}`;
        const response = await fetch(url);
        const pelicula = await response.json();
        return pelicula;
    } catch (error) {
        console.error('Error al obtener la película:', error);
        return null;
    }
}

// Función para eliminar una película de la lista de favoritos
function eliminarPeliculaFavorita(codigo) {
    const peliculasFavoritas = obtenerPeliculasFavoritas();
    const indice = peliculasFavoritas.indexOf(codigo);

    if (indice !== -1) {
        peliculasFavoritas.splice(indice, 1);
        localStorage.setItem('codigoFav', JSON.stringify(peliculasFavoritas));
        mostrarPeliculasFavoritas();
    }
}

// Agregar evento de clic a través de la delegación de eventos para eliminar películas desde el botón "Eliminar de Favoritos"
const contenedorFavoritas = document.getElementById('contenedorPeliculasFavoritas');
contenedorFavoritas.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-favorita')) {
        const tarjeta = event.target.closest('.favorita');
        const codigo = parseInt(tarjeta.querySelector('.codigo').textContent);
        eliminarPeliculaFavorita(codigo);
    }
});

// Mostrar las películas favoritas al cargar la página
mostrarPeliculasFavoritas();