const express = require('express');
const app = express();
require('dotenv').config();
const authRouter = require('./routers/auth');
const productRouter = require('./routers/products');
const cartRouter = require('./routers/carts');
const connectDB = require('./db');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/', (req, res) => {
  res.send('Express');
});

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
