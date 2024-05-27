# Middleware para la API de Mercado Libre

Este middleware actúa como intermediario entre la interfaz de usuario y la API de Mercado Libre, proporcionando endpoints optimizados y funcionalidades adicionales.

## Descripción

El propósito de este middleware es facilitar la interacción con la API de Mercado Libre, ofreciendo una capa adicional de abstracción y manejo de errores.

## Tecnologías Utilizadas

* **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.
* **Express:** Framework web minimalista para Node.js.
* **Axios:** Realización de peticiones HTTP a la API de Mercado Libre.
* **Cors:** Habilita el Intercambio de Recursos de Origen Cruzado (CORS) para permitir solicitudes desde el front-end.
* **Dotenv:** Carga variables de entorno desde un archivo `.env`.

## Endpoints

* **GET /items/:query:** Busca productos en la API de Mercado Libre utilizando el término de búsqueda proporcionado.
* **GET /items/:id:** Obtiene los detalles de un producto específico de la API de Mercado Libre.


## Instalación

1. Clona este repositorio: `git clone <URL_DEL_REPOSITORIO>`
2. Instala las dependencias: `npm install`
3. Inicia el servidor: `npm start`


## Autor

Enzo Romero

## Licencia

ISC