const express = require('express');
const mongoose = require('mongoose');
const Router = require('./router.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const cors = require('cors');
const corsConfig = {
    origin: "*",
    Credential: true,
    method: ["GET", "POST", "PUT", "DELETE"],
  }
  
  app.use(cors());
//   app.use(cors(corsConfig));
//   app.options("", cors(corsConfig));
  

const PORT = process.env.PORT || 8000;
const app = express();





mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB', err))

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', Router)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

