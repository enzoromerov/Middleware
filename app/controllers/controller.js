import { filterItems, filterItemDetails } from "../middleware/search.js";

async function getItems(req, res) {
  const searchQuery = req.query.q;
  const page = parseInt(req.query.page) || 1;  
  const limit = parseInt(req.query.limit) || 3; 


  try {
    const filteredData = await filterItems(searchQuery, page, limit);
    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener items" });
  }
}

async function getItemDetails(req, res) {
  const itemId = req.params.id;
  try {
    const filteredData = await filterItemDetails(itemId);
    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener detalles del item" });
  }
}

export { getItemDetails, getItems };