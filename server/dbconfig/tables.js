export const userTable = `
  CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email varchar(50) UNIQUE,
    first_name varchar(255),
    last_name varchar(255),
    password varchar(90),
    address varchar(30),
    is_admin boolean
  )`;

export const carTable = `
  CREATE TABLE IF NOT EXISTS Cars (
    id SERIAL PRIMARY KEY,
    owner int,
    created_on date,
    email varchar(50),
    state varchar(50),
    status varchar(50),
    price float(24),
    manufacturer varchar(50),
    model varchar(50),
    body_type varchar(50)
  )`;

export const orderTable = `
  CREATE TABLE IF NOT EXISTS Orders (
    id SERIAL PRIMARY KEY,
    buyer int,
    car_id int,
    amount float(24),
    status varchar(50)
  )`;

export const flagTable = `
  CREATE TABLE IF NOT EXISTS Flags (
    id SERIAL PRIMARY KEY,
    car_id int,
    created_on date,
    reason varchar(50),
    description varchar(50)
  )`;
