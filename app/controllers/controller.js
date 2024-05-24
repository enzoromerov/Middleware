import { filterItems, filterItemDetails } from "../middleware/search.js";

async function getItems(req, res) {
const searchQuery = req.query.q;
try {
const filteredData = await filterItems(searchQuery);
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