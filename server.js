#!/usr/bin/env node

const express = require('express');
const app = express();

const path = require('path');
const PORT = process.env.PORT ?? 3000;

app.set('port', PORT);

app.use(express.json(), function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        res.json({ errMsg: 'JSON Parse SyntaxError' });
    } else {
        next(err);
    }
});

app.get('/lib-js.js', function (req, res, next) {
    res.sendFile(path.join(__dirname, '/lib-js.js'));
});

app.get('/testView.html', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'testView.html'));
});

app.use(function (req, res, next) {
    res.json({ errMsg: '404' });
});

app.use(function (err, req, res, next) {
    res.json({ errMsg: '500' });
})

app.listen(PORT, function () {
    console.log('listen', PORT);
});