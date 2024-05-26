import test from 'ava';
import request from 'supertest';
import app from '../app.js';
import nock from 'nock';

// Datos de ejemplo para las respuestas simuladas (ajusta según tus necesidades)
const mockSearchResults = {
  results: [
    {
      id: "MLA1379378617",
      title: "Cargador Fast Apple Original iPhone 13 13 Pro Max Usb-c 20w Color Blanco - Distribuidor Autorizado",
      seller: { id: 12345 },
      category_id: "MLA1055",
      currency_id: "ARS",
      price: 60199,
      thumbnail: "http://http2.mlstatic.com/D_620616-MLA49003338062_022022-I.jpg",
      condition: "new",
      shipping: { free_shipping: true },
      available_quantity: 1
    },
    // ... más productos de ejemplo (puedes agregar 3 más para completar el límite de 4)
  ],
  paging: {
    total: 10,
    limit: 4,
    offset: 0,
  },
};

const mockItemDetails = {
  id: "MLA1415534875",
  title: "Conjunto Buzo Y Pantalón Jogging De Algodón Frisa Diseños 2",
  category_id: "MLA1430",
  currency_id: "ARS",
  price: 31900,
  pictures: [{ secure_url: "https://http2.mlstatic.com/D_863106-MLA75180620907_032024-O.jpg" }],
  condition: "new",
  shipping: { free_shipping: true },
  sold_quantity: 3098,
  description: "Descripción detallada del producto" // Agrega una descripción de ejemplo
};

const mockSellerAddress = {
  address: {
    city: "San Nicolás"
  }
};

const mockCategory = {
  path_from_root: [
    { name: "Celulares y Teléfonos" },
    { name: "Accesorios para Celulares" },
    { name: "Cargadores y Accesorios" },
    { name: "Cargadores" }
  ]
};

test.beforeEach(async (t) => {

  // Configurar el mock antes de cada prueba
  nock('https://api.mercadolibre.com')
  .get('/categories/MLA1430')
  .reply(200, mockCategory);

  // Mock para obtener las categorias de la busqueda
  nock('https://api.mercadolibre.com')
  .get('/categories/MLA1055') 
  .reply(200, mockCategory);

  nock('https://api.mercadolibre.com')
    .get('/sites/MLA/search')
    .query(true) 
    .reply(200, mockSearchResults);

  nock('https://api.mercadolibre.com')
    .get('/items/MLA1415534875')
    .reply(200, mockItemDetails)
    .get('/items/MLA1415534875/description')
    .reply(200, { plain_text: "Descripción del producto" });

  nock('https://api.mercadolibre.com')
    .get('/items/MLA999999999')
    .reply(404, {
      message: 'Item with id MLA999999999 not found',
      error: 'not_found',
      status: 404,
      cause: []
    });

  // Mock para obtener la ubicación del vendedor
  nock('https://api.mercadolibre.com')
    .get('/users/12345') // Reemplaza con el ID del vendedor en tus datos de ejemplo
    .reply(200, mockSellerAddress);

  // Mock para obtener las categorías
  nock('https://api.mercadolibre.com')
    .get('/categories/MLA1055') // Reemplaza con el ID de categoría en tus datos de ejemplo
    .reply(200, mockCategory);
});

test.afterEach(() => {
  // Limpiar los mocks después de cada prueba
  nock.cleanAll();
});


// Pruebas para el endpoint /api/items
test('GET /api/items should return a list of items with correct pagination', async (t) => {
  const res = await request(app).get('/api/items?q=apple&page=1&limit=4');

  t.is(res.statusCode, 200);
  t.truthy(res.body.data.author);
  t.truthy(res.body.data.categories);
  t.is(res.body.data.items.length, 4); 

  t.like(res.body.data.pagination, { 
    total: t.any(Number),
    limit: 4,
    page: 1,
    pages: t.any(Number),
  }); 

  const firstItem = res.body.data.items[0];
  t.truthy(firstItem.id);
  t.truthy(firstItem.title);
  t.truthy(firstItem.location);
  t.like(firstItem.price, {
    currency: t.any(String),
    amount: t.any(Number),
    decimals: t.any(Number),
  });
  t.truthy(firstItem.picture);
  t.truthy(firstItem.condition);
  t.truthy(firstItem.free_shipping);
  t.truthy(firstItem.available_quantity);
});

test('GET /api/items should return an empty object if no results are found', async (t) => {
  const res = await request(app).get('/api/items?q=producto_inexistente');
  t.is(res.statusCode, 200);
  t.deepEqual(res.body, {
    author: { name: "MercadoLibre", lastname: "" },
    categories: [],
    items: [],
    pagination: { total: 0, limit: 3, page: 1, pages: 0 },
  }); 
});


// Pruebas para el endpoint /api/items/:id
test('GET /api/items/:id should return item details', async (t) => {
  const itemId = 'MLA1415534875'; 
  const res = await request(app).get(`/api/items/${itemId}`);

  t.is(res.statusCode, 200);
  t.truthy(res.body.data.author);
  t.truthy(res.body.data.categories);
  t.truthy(res.body.data.item);

  const item = res.body.data.item;
  t.is(item.id, itemId);
  t.truthy(item.title);
  t.like(item.price, {
    currency: t.any(String),
    amount: t.any(Number),
    decimals: t.any(Number),
  });
  t.truthy(item.picture);
  t.truthy(item.condition);
  t.truthy(item.free_shipping);
  t.truthy(item.sold_quantity);
  t.truthy(item.description);
});

test('GET /api/items/:id should return 404 for an invalid ID', async (t) => {
  const invalidItemId = 'MLA999999999';
  const res = await request(app).get(`/api/items/${invalidItemId}`);
  t.is(res.statusCode, 404);
});