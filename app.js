const { Sequelize } = require('sequelize');
const {main} = require('./db/addTable');
const { seedDatabase } = require('./db/seed');
    
async function startApp() {
    await main()
    await seedDatabase()
}
startApp()