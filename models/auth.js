var token_array = [];

function generateToken(token) {
    token_array.push(token);
}

// function verifyToken(token) {
//     token_array.forEach(element => {
//         if (set('Authorisation', token))
//             return true
//         else
//             return false
//     });
// }

function verifyToken(token) {
    jwt.verify(token, 'Artur123', function(err, tokendata) {
        if (err) {
            return res.status(400).json({ message: ' Unauthorized request' });
        }
        if (tokendata)
            return true
        else
            return false
    })
}

function printToken() {
    token_array.forEach(element => {
        console.log(element)
    });
}
module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;
module.exports.printToken = printToken;