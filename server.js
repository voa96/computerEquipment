const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db/init_db');
const { main } = require('./db/addTable');
const { seedDatabase } = require('./db/seed');


const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'API Computer Equipment Store', version: '1.0' });
});


async function start() {
    try {

        await sequelize.authenticate();
        console.log('✅ База данных подключена');
        

        await main();
        // await seedDatabase();
        

        app.listen(port, () => {});
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
}

start();