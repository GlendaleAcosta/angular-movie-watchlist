var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cors = require('cors');

// Load environment variables
// ============================================================
dotenv.load({ path: '.env' });


var app = express();
var PORT = process.env.PORT || 3017;



// Middleware
// ============================================================
app.use(cors());
app.use(express.static(path.join(__dirname ,'public')));
app.use(bodyParser.json());


// Controllers (Route Handlers)
// ============================================================
var homeController = require('./controllers/home.js');
var userController = require('./controllers/user.js');


// Routes
// ============================================================
app.get('*', homeController);
app.post('/sign-up', userController.postSignUp);
app.post('/login', userController.postLogin);
// app.get('*', function(req, res, next){
//     res.sendFile(path.join(__dirname + '/public/index.html'));
// })



// Start Server
// ============================================================
app.listen( PORT , () => {
    console.log("App is up on port " + PORT);
});