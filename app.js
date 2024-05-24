// Load environment variables
import express from 'express';
import cors from 'cors';
import router from './app/routes/router.js';
import 'dotenv'; //

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');
// Import routes from the correct path (assuming a folder structure)
 // Assuming routes.js is in the same directory

app.use('/api/', router); // Mount the router with the '/api/1.0' prefix

app.listen(PORT, () => {
  console.log(`API lista por el puerto ${PORT}`);
});