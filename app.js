require('dotenv').config();
const path = require('path');
const pug = require('pug');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const { searchResult } = require('./controllers/searchResult');
const { currentWeather, getWeather } = require('./controllers/weatherResult');
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 3600 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: { useUnifiedTopology: true },
    }),
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// parsing the incoming data
app.use(express.json());

//serving static file
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(
  cors({
    origin: 'http://ec2-16-16-92-226.eu-north-1.compute.amazonaws.com:8000/',
  })
);

// Routes

app.get('/', (req, res) => {
  res.status(200).render('landing', {
    title: 'Local, National and Global Daily Weather Forecast',
  });
});

app.post('/search', searchResult);
app.post('/weather', currentWeather);
app.get('/weather', getWeather);

// creating server

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
