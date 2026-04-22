const { Sequelize } = require('sequelize');

const DB_NAME = 'компьютернаяТехника';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `./database/${DB_NAME}.sqlite`
});
async function CheckCreateDB() {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных установлено.');
        console.log('База данных существует или была создана.');
    } catch (error) {
        console.error('Ошибка при подключении к базе данных:', error);
    }
}

function createSequelizeConnector() {
    return new Sequelize({
        dialect: 'sqlite',
        storage: `./database/${DB_NAME}.sqlite`
    });
}

module.exports = {
    CheckCreateDB,
    createSequelizeConnector,
    DB_NAME,
    sequelize
};