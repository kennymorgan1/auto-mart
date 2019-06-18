import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const dropTables = async () => {
  await client.connect();
  await client.query('DROP TABLE IF EXISTS Users;');
  await client.query('DROP TABLE IF EXISTS Cars;');
  await client.query('DROP TABLE IF EXISTS Orders;');
  await client.query('DROP TABLE IF EXISTS Flags;');
  await client.end();
  console.log('User and Record tables dropped successfully');
  process.exit(0);
};

dropTables();
