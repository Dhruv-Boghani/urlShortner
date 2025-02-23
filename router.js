const express = require('express');
const { urlModel, UserModel } = require('./schema.js');
// const bodyParser = require('body-parser');
const shortId = require('short-id');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const secret = 'Dhruv@123$';

const routers = express.Router();
// routers.use(bodyParser.json());


routers.get('/logout', async (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});


routers.post('/', async (req, res) => {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, secret);
    const userID = decoded.userId;

    const originalURL = req.body.URL;
    const shortid = shortId.generate();
    const tclicks = 0;
    const date = Date.now();
    const name = req.body.name;

    if (!originalURL || typeof originalURL !== "string" || !originalURL.startsWith("http")) {
        return res.status(400).json({ error: "Invalid URL provided" });
    }

    else {

        try {

            const newURL = new urlModel({
                name: name,
                oURL: originalURL,
                sURL: shortid,
                clicks: tclicks,
                date: date,
                userID: userID
            });

            await newURL.save()
            res.render('newURL', { data: newURL });

        } catch (error) {
            console.error("Error while parsing URL:", error.message);
            console.error(error, "Malformed URL provided");
            res.status(400).json({ error: "Malformed URL provided" });
        }
    }

});

routers.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        return res.status(400).render('login', { message: 'Invalid email' });
    }

    if (password !== user.password) {
        return res.status(400).render('login', { message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, secret);
    res.cookie('token', token);
    res.redirect('/');
    // res.json({ message: 'Login successful' });
});

routers.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;
    const user = new UserModel({
        name: name,
        email: email,
        password: password
    });
    await user.save();
    //res.redirect( '/login', 200, { message: 'User created successfully' });
    res.render('login', { message: 'User created successfully' });

});

routers.get('/', async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.token) {
        return res.redirect('/login');
    }
    else {
        const token = cookies.token;
        const decoded = jwt.verify(token, secret);
        const user = await UserModel.findOne({ _id: decoded.userId });
        res.render('home', { entries: await urlModel.find({ userID: decoded.userId }), user: user });
    }
});

routers.get('/login', async (req, res) => {
    res.render('login', { message: '' });
});

routers.get('/sign-up', async (req, res) => {
    res.render('sign-up');
});


routers.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await urlModel.findOne({ sURL: shortId });

    if (!entry) {
        res.status(404).json('No URL Found')
    }
    else {
        entry.clicks += 1
        entry.save()
        res.redirect(entry.oURL)
    }
});

module.exports = routers;