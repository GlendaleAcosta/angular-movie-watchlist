var path = require('path');

exports.index = function(req, res) {    
    res.sendFile('index.html', { root: path.resolve(__dirname, '../public/') });
}