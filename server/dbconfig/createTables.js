import { Client } from 'pg';
import dotenv from 'dotenv';
import {
  userTable, carTable, orderTable, flagTable,
} from './tables';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const creeateTables = async () => {
  client.connect();

  await client.query(userTable);
  await client.query(carTable);
  await client.query(orderTable);
  await client.query(flagTable);
  await client.end();
  console.log('User and Record tables created successfully');
  process.exit(0);
};

creeateTables();

export default client;
