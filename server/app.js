import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import chalk from 'chalk';
import authRoutes from './routes/authrouters';
import carsRoutes from './routes/carsrouters';
import orderRoutes from './routes/orderrouters';

const app = express();
dotenv.config();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    data: 'Welcome to my API',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/car', carsRoutes);
app.use('/api/v1/order', orderRoutes);

app.use('*', (req, res) => res.status(404).json({ status: 404, error: 'Page not found' }));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(chalk.default.yellow.bgBlack.bold(`listening on port ${port}.....`)));
export default app;
