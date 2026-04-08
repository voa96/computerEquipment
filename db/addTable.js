const { Sequelize, DataTypes } = require('sequelize');
const { CheckCreateDB, createSequelize, DB_NAME } = require('./init_db');



function defineModel(sequelize){
    const User = sequelize.define('User', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name:{
            type:DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Без имени'
        },
        email:{
            type:DataTypes.STRING(50),
            validate:{
                isEmail:true
            }
        },
        phone:{
            type:DataTypes.STRING(15),
            allowNull: false,
        },
    },
    {
        timestamps:false,
        comment: 'Таблица с пользователями'
    })
    const Categories = sequelize.define('Categories',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type:DataTypes.STRING(50),
            allowNull:false,
        },
    },
    {
        timestamps: false,
        comment: 'Таблица категорий'
    })
    const Products = sequelize.define('Products', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type:DataTypes.STRING(80),
            allowNull:false,
        },
        price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        old_price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        stock:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT
        }
    },
    {
        timestamps: false,
        comment: 'Таблица продуктов'
    })
    const Orders = sequelize.define('Orders', {
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status:{
            type:DataTypes.STRING(30),
            defaultValue: 'новый заказ'
        },
        total_amount:{
            type:DataTypes.DECIMAL(10,2)
        },
        delivery_addres:{
            type:DataTypes.TEXT,
        },
        phone:{
            type:DataTypes.STRING(15),
            allowNull:false,
            validate:{
                isMobilePhone:'ru_RU'
            }
        },
        comment:{
            type:DataTypes.TEXT,
        }
    },
    {
        timestamps: false,
        comment: 'Таблица с заказов'
    })
    const Order_items = sequelize.define('Order_items',{
        id: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        }
    },
    {
        timestamps: false,
        comment: 'Таблица с предметами заказов'
    })
    Categories.hasMany(Products, { foreignKey: 'category_id' });
    Products.belongsTo(Categories, { foreignKey: 'category_id' });
    
    User.hasMany(Orders, { foreignKey: 'user_id' });
    Orders.belongsTo(User, { foreignKey: 'user_id' });
    
    Orders.hasMany(Order_items, { foreignKey: 'order_id' });
    Order_items.belongsTo(Orders, { foreignKey: 'order_id' });
    
    Products.hasMany(Order_items, { foreignKey: 'product_id' });
    Order_items.belongsTo(Products, { foreignKey: 'product_id' });
    return { User, Categories, Products, Orders, Order_items }
}

async function createTables(sequelize, User, Categories,Products,Orders,Order_items ) {
    const [result] = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`)
    if (result.length === 0){
        console.log('ошибка подключения');
    }
    else{
        await sequelize.sync({ force: false });
        console.log('таблицы созданы');
    }
}

async function fillTable(User,Categories,Products, Orders ,Order_items){
    const user = await User.bulkCreate([{
        name: 'Мавид',
        email:'mavidLisii@mail.ru',
        phone:'8 800 555 35 35',
    },
    {
        name: 'Антон',
        phone:'8 900 444 12 21'
    },
    {
        name:'Виталий',
        email:'vitaliy@gmail.com',
        phone:'8 905 900 18 50'
    },
    {
        name:'Милана',
        phone:'8 905 545 18 20',
    },
    {
        name:'Сергей',
        phone:'7 977 949 09 53',
    }
])
    const categories = await Categories.bulkCreate([
        { name: 'компьютер' },
        { name: 'корпус' },
        { name: 'видеокарта' },     
        { name: 'процессор' },
        { name: 'материнская плата' },
        { name: 'оперативная память' },
        { name: 'SSD накопитель' },
        { name: 'блок питания' },
        { name: 'вентилятор' },
    ])
    const cat = {};
    categories.forEach(c => {
        cat[c.name] = c.id;
    });
    const product = await Products.bulkCreate([
    // процессоры
    {
        name:'AMD Ryzen 7 5700X OEM',
        price: 15000 * 1.2,
        old_price:15000,
        stock: '3',
        category_id:cat['процессор']
    },
    {
        name:'Intel Core i5-12400F OEM',
        price:13300 * 1.2,
        old_price:13300,
        stock:'5',
        category_id:cat['процессор'],
    },
    // видеокарты
    {
        name:'Sapphire AMD Radeon RX 9070 XT PURE GAMING OC',
        price:70500 * 1.2,
        old_price:70500,
        stock:'3',
        category_id:cat['видеокартa'],
    },
    {
        name:'Palit GeForce RTX 5080 GamingPro',
        price:125000 * 1.2,
        old_price:125000,
        stock:'2',
        category_id:cat['видеокартa'],
    },
    // мат платы
    {
        name:'MSI B850 GAMING PLUS WIFI',
        price:19000 * 1.2,
        old_price: 19000,
        stock:'5',
        category_id:cat['материнская плата'],
    },
    {
        name:'GIGABYTE B850M AORUS ELITE WIFI6E ICE',
        price:18000 * 1.2,
        old_price: 18000,
        stock:'4',
        category_id:cat['материнская плата'],
    },
    // SSD накопители
    {
        name:'SATA накопитель Apacer AS350 PANTHER 1000ГБ',
        price:11600 * 1.2,
        old_price: 11600,
        stock:'4',
        category_id:cat['SSD накопитель'],
    },
    {
        name:'SATA накопитель MSI SPATIUM S270 480ГБ',
        price:8000 * 1.2,
        old_price: 8000,
        stock:'8',
        category_id:cat['SSD накопитель'],
    },
    ])
}

async function main() {
    const sequelize = createSequelize()
    await sequelize.authenticate();
    const {User, Categories, Products, Orders,Order_items} = defineModel(sequelize)
    await createTables(sequelize, User,Categories,Products, Orders ,Order_items)
    await fillTable(User,Categories,Products, Orders ,Order_items)
    await sequelize.close();
}

module.exports = {
    main,
}