// backend-beatles/utils/utilidades.js

// Define la función
const convertirCadenasVaciasANull = (obj) => {
  const resultado = { ...obj };
  for (const key in resultado) {
    if (Object.hasOwn(resultado, key)) {
      if (resultado[key] === '') {
        resultado[key] = null;
      }
    }
  }
  return resultado;
};

// Exporta la función
module.exports = {
  convertirCadenasVaciasANull
  // Puedes añadir otras funciones auxiliares aquí en el futuro
};