var express = require('express');
var path = require('path');
var dotenv = require('dotenv');

var app = express();
var PORT = process.env.PORT || 3017;



// Load environment variables
// ============================================================
dotenv.load({ path: '.env' });



// Middleware
// ============================================================
app.use(express.static(path.join(__dirname ,'public')));



// Controllers (Route Handlers)
// ============================================================
var homeController = require('./controllers/home.js');



// Routes
// ============================================================
app.get('*', homeController);



// Start Server
// ============================================================
app.listen( PORT , () => {
    console.log("App is up on port " + PORT);
});