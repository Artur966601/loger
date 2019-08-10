var express = require('express');
var C_tree = require('./createdb')

var router = express.Router();

bodyParser = require('body-parser').json();

router.post('/', bodyParser, (req, res) => {

    var parent = req.body.parent;

    if (!req.body.name)
        return res.status(400).send("Name is empty");
    else if (parent == "root" || parent == 0) { //!parent && C_tree.length == 0
        if (req.body.childe == 0)
            C_tree.findOne({}).exec(function(err, result) {
                if (result)
                    return res.status(400).send("Indvalid node")
                else {
                    var c_tree = new C_tree({
                        name: req.body.name,
                        parent: req.body.parent,
                        childe: "",
                    }).save();
                    return res.status(200).send("root created")
                }
            })
        else
            C_tree.findOne({ name: req.body.childe }).exec(function(err, result) {
                if (result) {
                    var c_tree = new C_tree({
                        name: req.body.name,
                        parent: req.body.parent,
                        childe: req.body.childe,
                    }).save();

                    C_tree.findOneAndUpdate({ name: req.body.childe }, { parent: req.body.name }, { safe: true, upsert: true, new: true },
                        function(err, model) {
                            if (err) return res.status(500).send(err);
                            return res.status(200) //.send("childes deleted")
                        }
                    )

                    return res.status(200).send("root added")
                } else
                    return res.status(400).send("Invalid childe")
            })
    }
    ////////////////////////////////////////////////////
    else {
        C_tree.findOne({ name: parent }).exec(function(err, result) {
            if (result) {

                var element_count = 0;
                var elements_pull = [];

                req.body.childe.forEach(element1 => {
                    result.childe.forEach(element2 => {
                        if (element1 == element2) {
                            elements_pull.push(element1);
                            element_count++;
                        }
                    });
                });

                if (req.body.childe.length <= element_count) {

                    elements_pull.forEach(element => {

                        C_tree.findOneAndUpdate({ name: parent }, { $pull: { childe: element } }, { safe: true, upsert: true, new: true },
                            function(err, model) {
                                if (err) return res.status(500).send(err);
                                return res.status(200) //.send("childes deleted")
                            }
                        );

                        C_tree.findOneAndUpdate({ name: element }, { parent: req.body.name }, { safe: true, upsert: true, new: true },
                            function(err, model) {
                                if (err) return res.status(500).send(err);
                                return res.status(200) //.send("childes deleted")
                            }
                        )


                    });

                    C_tree.findOneAndUpdate({ name: parent }, { $push: { childe: req.body.name } }, { safe: true, upsert: true, new: true },
                        function(err, model) {
                            if (err) return res.status(500).send(err);
                            return res.status(200).send("push childes")
                        }
                    );

                    var c_tree = new C_tree({
                        name: req.body.name,
                        parent: req.body.parent,
                        childe: req.body.childe,
                    }).save();
                }


                if (req.body.childe.length == 0) {
                    var c_tree = new C_tree({
                        name: req.body.name,
                        parent: req.body.parent,
                        childe: req.body.childe,
                    }).save();

                    C_tree.findOneAndUpdate({ name: parent }, { $push: { childe: req.body.name } }, { safe: true, upsert: true, new: true },
                        function(err, model) {
                            if (err) return res.status(500).send(err);
                            return res.status(200).send("childe created")
                        }
                    );
                }
            } else
                return res.status(200).send("Invalid position Name")
        })
    }
});



module.exports = router