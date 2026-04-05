const { Sequelize } = require('sequelize');
const {CheckCreateDB} = require('./db/init_db');
const {main} = require('./db/addTable');
const { start } = require('repl');
    
async function startApp() {
    await CheckCreateDB()
    await main()
}
startApp()