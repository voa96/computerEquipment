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
            type:DataTypes.STRING(11),
            allowNull: false,
            validate:{
                isMobilePhone:'ru_RU'
            }
        },
    },
    {
        timestamps:true,
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
        timestamps: true,
        comment: 'Таблица категорий'
    })
    const Products = sequelize.define('Products', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type:DataTypes.STRING(30),
            allowNull:true,
        },
        price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        old_price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        stock:{
            type:DataTypes.INTEGER,
            allowNull:true
        },
        description:{
            type:DataTypes.TEXT
        }
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
            type:DataTypes.STRING(11),
            allowNull:false,
            validate:{
                isMobilePhone:'ru_RU'
            }
        },
        comment:{
            type:DataTypes.TEXT,
        }
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

async function main() {
    const sequelize = createSequelize()
    await sequelize.authenticate();
    const {User, Categories, Products, Orders,Order_items} = defineModel(sequelize)
    await createTables(sequelize, User,Categories,Products, Orders ,Order_items)
    await sequelize.close();
}

module.exports = {
    main,
}