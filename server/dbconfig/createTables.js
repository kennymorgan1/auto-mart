import { Client } from 'pg';
import dotenv from 'dotenv';
import {
  userTable, carTable, orderTable, flagTable,
} from './tables';

dotenv.config();
let connectionString;

const dbconfig = {
  development: process.env.DATABASE_URL,
  test: process.env.DATABASE_TEST_URL,
};

if (process.env.NODE_ENV === 'development') {
  connectionString = dbconfig.development;
  console.log(connectionString);
} else if (process.env.NODE_ENV === 'test') {
  connectionString = dbconfig.test;
  console.log(connectionString, 'oo');
}

const client = new Client({
  connectionString,
});

const creeateTables = async () => {
  await client.connect();
  await client.query(userTable);
  await client.query(carTable);
  await client.query(orderTable);
  await client.query(flagTable);
  await client.end();
  console.log('User and Record tables created successfully');
  process.exit(0);
};

creeateTables();

export default dbconfig;
