const { Sequelize, DataTypes } = require('sequelize');
const { CheckCreateDB, createSequelizeConnector, DB_NAME, sequelize } = require('./init_db');

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
        comment: 'Таблица с заказами'
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
    try{
        sequelize.authenticate()
        await sequelize.sync({ force: false });
        console.log('табл созданы');
    } catch(err){
        console.err('ошибка', err)
    }
    }

async function main() {
    await sequelize.authenticate();
    const {User, Categories, Products, Orders,Order_items} = defineModel(sequelize)
    await createTables(sequelize, User,Categories,Products, Orders ,Order_items)
}

module.exports = {
    main,
    defineModel,
    createTables
}