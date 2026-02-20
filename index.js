const express = require('express');
const mongoose = require('mongoose');
const Router = require('./router.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require("path");



const cors = require('cors');
const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}
  


const PORT = process.env.PORT || 8000;
const app = express();


app.options("*", cors(corsConfig));
app.use(cors(corsConfig));



await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://dhruvboghani624:jQquPiMPGniQrb6T@kanishkastock.okpwf.mongodb.net/urlShortner?retryWrites=true&w=majority")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB', err))



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', Router)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})