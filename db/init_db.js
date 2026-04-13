const { Sequelize } = require('sequelize');

const DB_NAME = 'компьютернаяТехника'
const DB_USER = 'postgres'
const DB_PASS = '120150'
const DB_HOST = 'localhost';
const DB_PORT = 5432; 

async function CheckCreateDB() {
    const sequelize = new Sequelize('postgres', DB_USER, DB_PASS, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
    });
        const [result] = await sequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`);
    if (result.length === 0){
        await sequelize.query(`CREATE DATABASE ${DB_NAME};`)
        console.log('бд создана');
    }
    else{ 
        console.log('бд сущуствует');
    }
    await sequelize.close();
}

function createSequelizeConnector() {
    return new Sequelize(DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'postgres',
    });
}
module.exports = {
    CheckCreateDB,
    createSequelizeConnector,     
    DB_NAME,  
    DB_USER,    
    DB_PASS,   
    DB_HOST,   
    DB_PORT
};