
import express from 'express';
import cors from 'cors';
import router from './app/routes/router.js';
import 'dotenv'; 

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.disable('x-powered-by');


app.use('/api/', router); 

app.listen(PORT, () => {
  console.log(`API lista por el puerto ${PORT}`);
});
export default app;