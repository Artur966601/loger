/*
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });



mongoClient.connect(function(err, client) {
    if (err) throw err;
    console.log("Database created!");
    const db = client.db("C_tree");
    const collection = db.collection("data");

    module.exports.collection = db.collection("data");
    module.exports.client = client;


});

*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');


var category_schema = new Schema({
    name: { type: String, require: true },
    parent: { type: String, require: true },
    childe: { type: [], require: true }
});

module.exports = mongoose.model('C_tree', category_schema);