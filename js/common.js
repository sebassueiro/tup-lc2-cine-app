// Obtener datos de la API
async function SacarDatosAPI(){
    try{
    const apiKey = 'e288061cc427cc58c8fd098e51c15361';
      const language = 'es-ES';
      const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=${language}&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      return data.results;
    } catch (error){
        console.error('Error:', error);
        return [];
    }
}