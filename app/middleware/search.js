import axios from 'axios';

async function filterItems(searchQuery) {
  const searchResponse = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${searchQuery}`);
  const formattedData = {
    author: {
      name: 'MercadoLibre', // Reemplazar con el nombre real del autor si está disponible
      lastname: '',
    },
    categories: async () => {
      const firstCategoryId = searchResponse.data.results[0].category_id;
      const categoryResponse = await axios.get(`https://api.mercadolibre.com/categories/${firstCategoryId}`);
      const categoryNames = [];

      for (const category of categoryResponse.data.path_from_root) {
        categoryNames.push(category.name);
      }

      return categoryNames;
    },
    items: searchResponse.data.results.slice(0, 4).map((item) => ({
      id: item.id,
      title: item.title,
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
  const descriptionResponse = await axios.get(`https://api.mercadolibre.com/items/${itemId}/description`);

  const formattedData = {
    author: {
      name: 'MercadoLibre', // Reemplazar con el nombre real del autor si está disponible
      lastname: '',
    },
    item: {
      id: itemResponse.data.id,
      title: itemResponse.data.title,
      price: {
        currency: itemResponse.data.currency_id,
        amount: itemResponse.data.price,
        decimals: itemResponse.data.decimal_price,
      },
      picture: itemResponse.data.thumbnail,
      condition: itemResponse.data.condition,
      free_shipping: itemResponse.data.shipping.free_shipping,
      sold_quantity: itemResponse.data.sold_quantity,
      description: descriptionResponse.data.plain_text,
    },
  };
  return formattedData;
}

export { filterItems, filterItemDetails }; 