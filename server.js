// Modules/ Libraries
var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cors = require('cors');
var sass = require('node-sass');
var sassMiddleware = require('node-sass-middleware');

// Load environment variables
dotenv.load({ path: '.env' });
 

// Server
var app = express();
var PORT = process.env.PORT || 3017;


// Controllers (Route Handlers)
var homeController = require('./controllers/home.js');
var userController = require('./controllers/user.js');
var watchlistController = require('./controllers/watchlist');
var favoritesController = require('./controllers/favorites.js');
var watchedMoviesController = require('./controllers/watchedMovies.js');
var authorizeController = require('./controllers/authorize');

// Middleware
app.use(cors());
app.use(sassMiddleware({
    src: __dirname + '/public/stylesheets/sass',
    dest: __dirname + '/public/stylesheets',
    debug: true,
    outputStyle: 'compressed',
    indentedSyntax: true,
    prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname ,'public')));
app.use(bodyParser.json());
app.use('*', authorizeController);



// Routes
app.post('/sign-up', userController.postSignUp);
app.post('/login', userController.postLogin);
app.post('/authenticate', userController.postAuthenticate);
app.get('/watchlist', watchlistController.getWatchlist);
app.post('/watchlist', watchlistController.postWatchlist);
app.delete('/watchlist', watchlistController.deleteWatchlist);
app.get('/favorites', favoritesController.getFavoriteMovies);
app.post('/favorites', favoritesController.postFavoriteMovies);
app.delete('/favorites', favoritesController.deleteFavoriteMovies);
app.get('/*', homeController.index);


// Start Server
app.listen( PORT , () => {
    console.log("App is up on port " + PORT);
});
