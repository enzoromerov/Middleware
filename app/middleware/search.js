import axios from 'axios';

async function filterItems(searchQuery) {
  const searchResponse = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${searchQuery}`);
  const sellerIds = searchResponse.data.results.slice(0, 4).map(item => item.seller.id);
  console.log(sellerIds)
  const locations = await Promise.all(sellerIds.map(getLocation));
  const formattedData = {
    author: {
      name: 'MercadoLibre', 
      lastname: '',
    },
    categories: await getCategories(searchResponse.data.results[0].category_id), // Llamar a una función separada para obtener las categorías
    items: searchResponse.data.results.slice(0, 4).map((item, index) => ({
      id: item.id,
      title: item.title,
      location: locations[index],
      price: {
        currency: item.currency_id,
        amount: item.available_quantity,
        decimals: item.price,
      },
      picture: item.thumbnail,
      condition: item.condition,
      free_shipping: item.shipping.free_shipping,
    })),
  };
  return formattedData;
}

async function filterItemDetails(itemId) {
  const itemResponse = await axios.get(`https://api.mercadolibre.com/items/${itemId}`);
  const descriptionResponse = await axios.get(`https://api.mercadolibre.com/items/${itemResponse.data.id}/description`);
  console.log(descriptionResponse.data)
  const formattedData = {
    author: {
      name: 'MercadoLibre', 
      lastname: '',
    },
    categories: await getCategories(itemResponse.data.category_id),
    item: {
      id: itemResponse.data.id,
      title: itemResponse.data.title,
      price: {
        currency: itemResponse.data.currency_id,
        amount: itemResponse.data.price,
        decimals: itemResponse.data.decimal_price,
      },
      picture: itemResponse.data.pictures[0].secure_url,
      condition: itemResponse.data.condition,
      free_shipping: itemResponse.data.shipping.free_shipping,
      sold_quantity: itemResponse.data.sold_quantity,
      description: descriptionResponse.data.plain_text,
    },
  };
  return formattedData;
}

async function getCategories(categoryId) {
  const categoryResponse = await axios.get(`https://api.mercadolibre.com/categories/${categoryId}`);
  const categoryNames = [];
  for (const category of categoryResponse.data.path_from_root) {
    categoryNames.push(category.name);
  }
  return categoryNames;
}
async function getLocation(sellerId) {
  const sellerResponse = await axios.get(`https://api.mercadolibre.com/users/${sellerId}`);
  return sellerResponse.data.address.city;
}

export { filterItems, filterItemDetails }; 