var express = require('express');
const bcrypt = require('bcryptjs');
// var auth = require('../models/auth')
var router = express.Router();
var jwt = require('jsonwebtoken')


bodyParser = require('body-parser').json();

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];


        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
};

router.get('/', checkToken, (req, res) => {


    jwt.verify(req.token, 'Artur123', (err, authorizedData) => {
        if (err) {
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
        } else {
            //If token is successfully verified, we can send the autorized data 
            res.json({
                message: 'Successful log in',
                authorizedData
            });
            console.log('SUCCESS: Connected to protected route');
        }
    });

});

//Check to make sure header is not undefined, if so, return Forbidden (403)



module.exports = router