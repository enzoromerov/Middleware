import axios from 'axios';

async function filterItems(searchQuery, page, limit) {
  const offset = (page - 1) * limit;
  const searchResponse = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${searchQuery}`);
  

  const paginatedResults = searchResponse.data.results.slice(offset, offset + limit);
  const sellerIds = paginatedResults.map(item => item.seller.id);
  
  const locations = await Promise.all(sellerIds.map(getLocation));
  const formattedData = {
    author: {
      name: 'MercadoLibre', 
      lastname: '',
    },
    categories: await getCategories(searchResponse.data.results[0].category_id),
    items: paginatedResults.map((item, index) => ({
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
      available_quantity: item.available_quantity,
    })),
    pagination: {
      total: searchResponse.data.paging.total,
      limit: limit,
      page: page,
      pages: Math.ceil(searchResponse.data.paging.total / limit),
    },
  };
  return formattedData;
}

async function filterItemDetails(itemId) {
  const itemResponse = await axios.get(`https://api.mercadolibre.com/items/${itemId}`);
  const descriptionResponse = await axios.get(`https://api.mercadolibre.com/items/${itemResponse.data.id}/description`);
  
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
      sold_quantity: itemResponse.data.initial_quantity,
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