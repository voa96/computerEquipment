const { Sequelize } = require('sequelize');
const {CheckCreateDB} = require('./db/init_db');
const {main} = require('./db/addTable');

    
async function startApp() {
    await CheckCreateDB()
    await main()
}
startApp()