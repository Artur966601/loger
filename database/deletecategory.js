var express = require('express');
var C_tree = require('./createdb')

var router = express.Router();

bodyParser = require('body-parser').json();

router.post('/', bodyParser, (req, res) => {

    C_tree.findOne({ name: req.body.name }).exec(function(err, result) {
        if (!result)
            return res.status(200).send("No Item")
        else if (result.parent == 0 || result.parent == null) {

            C_tree.findOneAndUpdate({ name: req.body.name }, { name: "root" }, { safe: true, upsert: true, new: true },
                function(err, model) {
                    if (err) return res.status(500).send(err);
                    return res.status(200);
                }
            )

            result.childe.forEach(element => {
                C_tree.findOneAndUpdate({ name: element }, { parent: "root" }, { safe: true, upsert: true, new: true },
                    function(err, model) {
                        if (err) return res.status(500).send(err);
                        return res.status(200);
                    }
                )
            })
            return res.status(200).send("Root name rename to 'root' ")
        } else {

            C_tree.findOneAndUpdate({ name: result.parent }, { $pull: { childe: req.body.name } }, { safe: true, upsert: true, new: true },
                function(err, model) {
                    if (err) return res.status(500).send(err);
                    return res.status(200) //.send("childes deleted")
                }
            );

            result.childe.forEach(element => {

                C_tree.findOneAndUpdate({ name: element }, { parent: result.parent }, { safe: true, upsert: true, new: true },
                    function(err, model) {
                        if (err) return res.status(500).send(err);
                        return res.status(200);
                    }
                )

                C_tree.findOneAndUpdate({ name: result.parent }, { $push: { childe: element } }, { safe: true, upsert: true, new: true },
                    function(err, model) {
                        if (err) return res.status(500).send(err);
                        return res.status(200) //.send("childes deleted")
                    }
                );
            })

            C_tree.deleteOne({ name: req.body.name }, function(err) {
                if (err) return res.status(500).send(err);
                return res.status(200) //.send("childes deleted")
            });

            return res.status(200).send("Node deleted")
        }
    });
})

module.exports = router