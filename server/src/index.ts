import express, { Application } from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app: Application = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', gameRoutes);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
