const express = require('express')
const { Sequelize } = require('sequelize');
const { createSequelizeConnector } = require('./init_db');


const app = express();
const PORT = 3000

const sequelize = createSequelizeConnector()

app.post('/User', async(req, res) =>{
    const {name, email} = req.body
    try{
        const result = await pool.query('SELECT * FROM User')
        res.json(result,rows)
    }
    catch(err){
        res.status(500).send(err.message)
    }
})