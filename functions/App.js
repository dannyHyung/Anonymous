const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        'https://anonymous-890cf.firebaseapp.com',
        'https://anonymous-890cf.web.app'
    ],
    // origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

app.use('/', routes);

// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
