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
        category_id:{
            type:DataTypes.INTEGER,
            references:{
                model: 'Categories',
                key: 'id'
            }
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
            primaryKey: true
        },
        user_id:{
            type:DataTypes.INTEGER,
            references:{
                model:"User",
                key:'id'
            }
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
            primaryKey: true
        },
        order_id:{
            type:DataTypes.INTEGER,
            references:{
                model:'orders',
                key:'id'
            },
        },
        product_id:{
            type:DataTypes.INTEGER,
            references:{
                model:'Products',
                key:'id'
            }
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
    return { User, Categories, Products, Orders, Order_items }
}

async function createTables(sequelize, User, Categories,Products, ) {
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