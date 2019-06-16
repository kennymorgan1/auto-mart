import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let connectionString;

if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DATABASE_URL;
  console.log(connectionString);
} else if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DATABASE_TEST_URL;
  console.log(connectionString);
}

const client = new Client({
  connectionString,
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
