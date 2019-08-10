const express = require('express');

const register = require('./routes/register');
const login = require('./routes/login');
const mypage = require('./pages/mypage');
const addcategory = require('./database/addcategory');
const deletecategory = require('./database/deletecategory');

const app = express();

// add mongoose 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database', { useNewUrlParser: true });


app.use('/register', register);
app.use('/login', login);
app.use('/mypage', mypage);
app.use('/addcategory', addcategory);
app.use('/deletecategory', deletecategory);

// app.use(router);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server listening at http://localhost:' + port);
});