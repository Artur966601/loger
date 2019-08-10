var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var User = require('../models/user');
var auth = require('../models/auth')

const SECRET_KEY = "Artur123";

var router = express.Router();

bodyParser = require('body-parser').json();

router.post('/', bodyParser, (req, res) => {

    let promise = User.findOne({ email: req.body.email }).exec();

    promise.then(function(doc) {
        if (doc) {
            if (doc.isValid(req.body.password)) {
                // generate token
                let token = jwt.sign({ id: doc._id }, SECRET_KEY, { expiresIn: '3h' });
                auth.generateToken(token);
                auth.printToken();
                return res.status(200).json(token);

            } else {
                return res.status(501).json({ message: ' Invalid password' });
            }
        } else {
            return res.status(501).json({ message: 'User email is not registered.' })
        }
    });

    promise.catch(function(err) {
        return res.status(501).json({ message: 'Some internal error' });
    })


});


module.exports = router