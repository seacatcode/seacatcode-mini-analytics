#!/usr/bin/env node

const express = require('express');
const app = express();

const path = require('path');

const config = require('./config');

const PORT = config.PORT ?? 3000;

app.set('port', PORT);

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '7200');
    next();
})

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

let genNumber = new Array(10).fill(0b0).map((v, idx) => String.fromCharCode('0'.charCodeAt(0) + idx));
let genAlphabet = new Array(26).fill(0b0).map((v, idx) => String.fromCharCode('a'.charCodeAt(0) + idx));
let genTable = [genNumber, genAlphabet].flat(1);
app.get('/create', async (req, res, next) => {
    let d = new Date();
    let genDate = String(d.getFullYear()).padStart(4, '0') + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');

    let result = [];
    while (result.length < 16) {
        result.push(genTable[Math.floor(Math.random() * genTable.length)]);
    }

    res.setHeader('Content-TypegenDate', 'text/plain');
    res.status(200).send(genDate.concat(result.join('')));
});

app.get('/none', (req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendStatus(204);
})

app.use(function (req, res, next) {
    res.json({ errMsg: '404' });
});

app.use(function (err, req, res, next) {
    res.json({ errMsg: '500' });
})

app.listen(PORT, function () {
    console.log('listen', PORT);
});