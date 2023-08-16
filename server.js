#!/usr/bin/env node

const express = require('express');
const app = express();

const mariadb = require('mariadb');

const path = require('path');

const config = require('./config');

const pool = mariadb.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    database: 'seacatcode_mini_analytics',
    connectionLimit: 100
});

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

function genRandom() {
    let d = new Date();
    let genDate = String(d.getFullYear()).padStart(4, '0') + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');

    let result = [];
    while (result.length < 16) {
        result.push(genTable[Math.floor(Math.random() * genTable.length)]);
    }
    return genDate.concat(result.join(''));
}

app.get('/create', async (req, res, next) => {

    let conn;
    let code, tryFlag = true, reCnt = 0, maxCnt = 999;

    while (tryFlag && reCnt < maxCnt) {
        code = genRandom();
        try {
            //반복 maxCnt 가 작은경우 connection 을 가지고 반복하고
            //maxCnt가 클 경우 나중에 받은 요청에서 timeout 을 만나지 않도록 바로 반환 하고 있음
            conn = await pool.getConnection();
            await conn.query("INSERT UK_LIST (CODE) VALUES(?);", [code]);
            tryFlag = false;
        } catch (reason) {
            if (reason.code === 'ER_DUP_ENTRY') {
                tryFlag = true;
                reCnt++;
            } else {
                reCnt = maxCnt;
            }
        } finally {
            if (conn) conn.release();
        }
    }

    if (!tryFlag) {
        res.setHeader('Content-TypegenDate', 'text/plain');
        res.status(200).send(code);
    } else {
        res.setHeader('Content-TypegenDate', 'text/plain');
        res.status(500).send(' ');
    }
});

// TODO: 변수 사용시 공유되지 않아 데이터의 무결성 이슈 => Redis 전환
const memoryActiveUserData = {

}

// TODO: 클러스터 마스터 노드에서 처리 => 변수가 아닌 Redis 전환
const memoryActiveUserDataInterval = setInterval(function () {
    //memoryActiveUserData 시작 시간과 마지막 핑 시간을 기록하여 세션 유지 시간을 계산
}, 1 * 60 * 1000);

app.get('/ping', async (req, res, next) => {
    try {
        const { t, code } = req.query;

        // 시작 시간과 마지막 핑 시간을 기록하여 세션 유지 시간을 계산
        memoryActiveUserData[code] = t;

        conn = await pool.getConnection();
        await conn.query("INSERT PING_LIST (T,CODE) VALUES(?,?);", [t, code]);
    } catch (reason) {
        console.log(reason.code);
    } finally {
        if (conn) conn.release();
    }
    res.setHeader('Content-Type', 'text/plain');
    res.sendStatus(204);
});

app.get('/visibility', async (req, res, next) => {
    try {
        const { t, hidden } = req.query;
    } catch (reason) {
        console.log(reason.code);
    } finally {

    }
    res.setHeader('Content-Type', 'text/plain');
    res.sendStatus(204);
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