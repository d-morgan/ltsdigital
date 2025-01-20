import express, { Application } from 'express';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', gameRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
