// Variable Pagina Actual
var paginaActual = 1; 

async function consultarCartelera() {
  const resultados = await SacarDatosAPI();

  const cartelera = document.getElementById('contenedorPeliculas');
  cartelera.innerHTML = '';
    
    for (const pelicula of resultados){
      const { poster_path, title, id, original_title, original_language, release_date } = pelicula;

      const tarjeta = document.createElement('div');
      tarjeta.classList.add('cartelera');
      tarjeta.innerHTML = `
        <div class="detalle">
          <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
          <h3 class="titulo">${title}</h3>
          <p>
            <b>Código:</b> <span class="codigo">${id}</span><br>
            <b>Título original:</b> ${original_title}<br>
            <b>Idioma original:</b> ${original_language}<br>
            <b>Año:</b> ${release_date}<br>
          </p>
          <button class="boton-agregar button radius medium">Agregar a Favoritos</button>
        </div>
      `;
  
      cartelera.appendChild(tarjeta);
    };
}

// Cambiar a la página siguiente
function PaginaSiguiente() {
  paginaActual++;
  consultarCartelera();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cambiar a la página anterior
function PaginaAnterior() {
  if (paginaActual > 1) {
      paginaActual--;
      consultarCartelera();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Para que funcionen los botones
document.getElementById('btnAnterior').addEventListener('click', PaginaAnterior);
document.getElementById('btnSiguiente').addEventListener('click', PaginaSiguiente);

// Llamar a la función para mostrar la cartelera inicial
consultarCartelera();

// Función por código a Fav
async function agregarPeliculaPorCodigo(codigo) {
  //Crea un array en el local Storage llamado codigoFav
  const favorito = JSON.parse(localStorage.getItem('codigoFav')) || [];

  //Las condiciones para los Mensajes
  if (favorito.includes(codigo)) {
    mostrarMensaje('Warning');
    return;
  }

  const resultados = await SacarDatosAPI();
  //Esto se fija si hay un codigo igual en el array
  const peliculaExistente = resultados.find(pelicula => pelicula.id === codigo);

  if (!peliculaExistente) {
    mostrarMensaje('Error');
    return;
  }

  //Agrega el codigo y muestra el mensaje
  favorito.push(codigo);
  localStorage.setItem('codigoFav', JSON.stringify(favorito));
  mostrarMensaje('Success');
}

// Función para agregar películas a favoritos por boton
async function agregarPeliculaDesdeBoton(event) {
  if (event.target.classList.contains('boton-agregar')) {
      const tarjeta = event.target.closest('.cartelera');
      const codigo = parseInt(tarjeta.querySelector('.codigo').textContent);
      await agregarPeliculaPorCodigo(codigo);
  }
}

// Función para mostrar mensajes
function mostrarMensaje(idMensaje) {
  const mensaje = document.getElementById(idMensaje);
  mensaje.style.display = 'block';
  setTimeout(() => {
      mensaje.style.display = 'none';
  }, 4000);
}

// Asignar evento de submit al formulario para agregar películas por código
const formFavoritos = document.getElementById('form-favoritos');
formFavoritos.addEventListener('submit', async event => {
    event.preventDefault();
    const codigoInput = document.getElementById('codigoFavorito');
    const codigo = parseInt(codigoInput.value.trim());
    await agregarPeliculaPorCodigo(codigo);
    codigoInput.value = '';
});

// Obtener el contenedor de las tarjetas de película
const cartelera = document.getElementById('contenedorPeliculas');

// Agregar evento de clic a través de la delegación de eventos para agregar películas desde el botón "Agregar a Favoritos"
cartelera.addEventListener('click', agregarPeliculaDesdeBoton);

consultarCartelera();