import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows the server to read JSON data

app.get('/', (req: Request, res: Response) => {
  res.send('FERN Stack Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});