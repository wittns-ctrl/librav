/*import connectdb from './src/db.js';
import route from  './src/bookRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectdb();
app.use(express.json());
app.use('/book',route);
app.listen(PORT,
   () => { console.log('server running');
});*/

dotenv.config();
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import router from './src/routes/bookRoutes.js';


const app = express();
app.use(express.json());

(async () => {
  await connectDB();
  app.use('/api/books', router);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
