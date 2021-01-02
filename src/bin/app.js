import express from 'express'
import configureApp from '../config/configureApp'
import { getConfig } from '../config/global_config'
import connectMongo from '../db/mongoConnection'
// import { db as mysqlConnection } from '../db/mysqlConnection'
import mongoose from 'mongoose'

const port = getConfig('/port')
const app = express()

configureApp(app)
connectMongo(mongoose)

// use for mysql database

// mysqlConnection.getConnection((err,connection) => {
//     if(connection){
//         console.log('Connected to mysql database')
//     }else{
//         console.log(err)
//     }
// })

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})
