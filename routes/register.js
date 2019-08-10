var express = require('express');
var User = require('../models/user');
const bcrypt = require('bcrypt');

// const SECRET_KEY = "Artur123";

var router = express.Router();

bodyParser = require('body-parser').json();



/**
 * @swagger
 * /register:
 *  post:
 *      tags:
 *          - UserSchema
 *      description: registration
 *      consumes:
 *          - application/json
 *      produces:
 *          - application/json
 *      parameters:
 *          - email: string
 *            username: string
 *            password: string
 *      responses:
 *          400:
 *            description: This Email has already been registered
 *            schema:
 *              $ref: '#/definitions/error'
 *          201:
 *            description: User successfully registered
 *            schema:
 *              $ref: '#/definitions/success'
 */
router.post('/', bodyParser, (req, res) => {

    console.log(req.body);

    User.find({ email: req.body.email }).exec(function(err, result) {
        if (err) return console.error(err);
        else if (result.length) return res.status(400).send("This Email has already been registered")
        else {

            var user = new User({
                email: req.body.email,
                username: req.body.username,
                password: User.hashPassword(req.body.password),
                // creation_dt: Date.now()
            });
            let promise = user.save();

            promise.then(function(doc) {
                return res.status(201).json(doc);
            })


            promise.catch(function(err) {
                return res.status(501).json({ message: 'Error registering user.' })
            })

        }

    })


});



module.exports = router