const express = require('express')
const { Sequelize } = require('sequelize');
const { createSequelizeConnector } = require('./init_db');
const { defineModel } = require('./addTable')

const app = express()

const sequelize = createSequelizeConnector()
const {User, Categories, Products, Orders,Order_items} = defineModel(sequelize)

