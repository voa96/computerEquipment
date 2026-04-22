const { sequelize } = require('./init_db');
const { defineModel } = require('./addTable');

async function seedDatabase() {
    try {
        const { User, Categories, Products, Orders, Order_items } = defineModel(sequelize);
        
        
        const users = await User.bulkCreate([
            {
                name: 'Мавид',
                email: 'mavidLisii@mail.ru',
                phone: '+7 800 555-35-35',
            },
            {
                name: 'Антон',
                email: 'anton@mail.ru',
                phone: '+7 900 444-12-21',
            },
            {
                name: 'Виталий',
                email: 'vitaliy@gmail.com',
                phone: '+7 905 900-18-50',
            },
            {
                name: 'Милана',
                email: 'milana@mail.ru',
                phone: '+7 905 545-18-20',
            },
            {
                name: 'Сергей Петров',
                email: 'sergey.petrov@yandex.ru',
                phone: '+7 977 949-09-53',
            }
        ]);
        
        
        const categories = await Categories.bulkCreate([
            { name: 'Процессоры' },
            { name: 'Видеокарты' },
            { name: 'Материнские платы' },
            { name: 'Оперативная память' },
            { name: 'SSD накопители' },
        ]);

        
        const cat = {};
        categories.forEach(c => {
            cat[c.name] = c.id;
        });
        
        // ==================== 3. ЗАПОЛНЯЕМ ПРОДУКТЫ (5 записей) ====================
        
        const products = await Products.bulkCreate([
            {
                name: 'AMD Ryzen 7 5700X',
                price: 15000 * 1.2,
                old_price: 15000,
                stock: 3,
                category_id: cat['Процессоры'],
                description: '8 ядер, 16 потоков, сокет AM4, 3.4 ГГц, 32 МБ кэша L3'
            },
            {
                name: 'NVIDIA GeForce RTX 4070 Ti',
                price: 85000 * 1.2,
                old_price: 85000,
                stock: 5,
                category_id: cat['Видеокарты'],
                description: '12GB GDDR6X, 7680 ядер CUDA, поддержка DLSS 3, Ray Tracing'
            },
            {
                name: 'MSI B650 GAMING PLUS WIFI',
                price: 19000 * 1.2,
                old_price: 19000,
                stock: 4,
                category_id: cat['Материнские платы'],
                description: 'Socket AM5, DDR5, PCIe 4.0, Wi-Fi 6E, 2.5G LAN'
            },
            {
                name: 'Kingston Fury DDR5 32GB',
                price: 12000 * 1.2,
                old_price: 12000,
                stock: 7,
                category_id: cat['Оперативная память'],
                description: '32GB (2x16GB), DDR5, 5600MHz, CL36, черный радиатор'
            },
            {
                name: 'Samsung 980 Pro 1TB NVMe',
                price: 15000 * 1.2,
                old_price: 15000,
                stock: 6,
                category_id: cat['SSD накопители'],
                description: '1TB, PCIe 4.0, скорость чтения 7000 МБ/с, скорость записи 5100 МБ/с'
            },
        ]);
        
        const prod = {};
        products.forEach(p => {
            prod[p.name] = p.id;
        });
        
        const orders = await Orders.bulkCreate([
            {
                status: 'новый заказ',
                total_amount: 0, // будет рассчитано позже
                delivery_addres: 'г. Москва, ул. Тверская, д.15, кв.45',
                phone: '+7 800 555-35-35',
                comment: 'Позвонить за 30 минут до доставки',
                user_id: users[0].id
            },
            {
                status: 'обработан',
                total_amount: 0,
                delivery_addres: 'г. Санкт-Петербург, Невский пр-т, д.25, кв.12',
                phone: '+7 900 444-12-21',
                comment: 'Оставить у двери',
                user_id: users[1].id
            },
            {
                status: 'доставлен',
                total_amount: 0,
                delivery_addres: 'г. Новосибирск, ул. Ленина, д.50, кв.8',
                phone: '+7 905 900-18-50',
                comment: 'Оплата наличными',
                user_id: users[2].id
            },
            {
                status: 'отменен',
                total_amount: 0,
                delivery_addres: 'г. Екатеринбург, ул. Малышева, д.30, кв.67',
                phone: '+7 905 545-18-20',
                comment: 'Передумал, отмена заказа',
                user_id: users[3].id
            },
            {
                status: 'новый заказ',
                total_amount: 0,
                delivery_addres: 'г. Казань, ул. Баумана, д.10, кв.23',
                phone: '+7 977 949-09-53',
                comment: 'Домофон не работает, звоните в домофон 23',
                user_id: users[4].id
            },
        ]);
        
        const orderItems = await Order_items.bulkCreate([
            {
                quantity: 1,
                price: products[0].price, 
                order_id: orders[0].id,
                product_id: products[0].id
            },

            {
                quantity: 1,
                price: products[1].price, 
                order_id: orders[1].id,
                product_id: products[1].id
            },
            {
                quantity: 2,
                price: products[3].price, 
                order_id: orders[1].id,
                product_id: products[3].id
            },

            {
                quantity: 1,
                price: products[2].price, 
                order_id: orders[2].id,
                product_id: products[2].id
            },
            {
                quantity: 1,
                price: products[4].price, 
                order_id: orders[2].id,
                product_id: products[4].id
            },

            {
                quantity: 1,
                price: products[0].price, 
                order_id: orders[3].id,
                product_id: products[0].id
            },

            {
                quantity: 1,
                price: products[1].price,
                order_id: orders[4].id,
                product_id: products[1].id
            },
            {
                quantity: 1,
                price: products[2].price,
                order_id: orders[4].id,
                product_id: products[2].id
            },
            {
                quantity: 2,
                price: products[4].price, 
                order_id: orders[4].id,
                product_id: products[4].id
            },
        ]);
        
        for (const order of orders) {
            const items = await Order_items.findAll({
                where: { order_id: order.id }
            });

            let total = 0;
            for (const item of items) {
                total += item.quantity * item.price;
            }
            
            await order.update({ total_amount: total });
        }

        const usersCount = await User.count();
        const categoriesCount = await Categories.count();
        const productsCount = await Products.count();
        const ordersCount = await Orders.count();
        const orderItemsCount = await Order_items.count();

        return {
            users,
            categories,
            products,
            orders,
            orderItems
        };
        
    } catch (error) {
        console.error('Ошибка при заполнении базы данных:', error);
        throw error;
    }
}

module.exports = {
    seedDatabase
};