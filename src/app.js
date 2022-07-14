'use strict';
const express = require('express');
const app = express();
const path =require('path')
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection')

//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
//importing routes
const customerRoutes = require('./routes/customer')


//middleware
app.use(morgan('dev'))
app.use(myConnection(mysql,{
    host:'localhost',
    user:'root',
    password:'',
    port:3306,
    database:'book-directions',
},'single'))
// app.use(function(req,res){
//     res.status(404).render('404')
// })

//routes 
app.all('/contacts',customerRoutes)
app.all('/contacts.save',customerRoutes)
app.all('/contacts/:id?',customerRoutes)
app.all('/contacts.delete/:id?',customerRoutes)
app.get('*',(req,res)=>{
    res.status(404).render('404')
})






//statics files




//starting server
app.listen(app.get('port'),()=>{
    console.log('server on port 3000');
   
})