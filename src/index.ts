import dotenv from 'dotenv';
import { connectToDatabase } from './lib/dbConnection';
import { app } from './app';

dotenv.config({ path: './.env' });

async function start() {
  await connectToDatabase();

  app.listen(process.env.HTTP_PORT, () => {
    console.log(`Server running on http://localhost:${process.env.HTTP_PORT}`);
  });
}

start();
