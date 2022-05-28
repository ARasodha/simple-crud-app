const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const {Pool} = require('pg');
require('dotenv').config();

let pool = new Pool();
const PORT = process.env.PORT;

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/info/get', (req, res) => {
    try {
        pool.connect(async (error, client, release) => {
        let resp = await client.query(`SELECT * FROM test`);
        release();
        res.send(resp.rows);
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/info/add', (req, res) => {
    try {
        pool.connect( async (error, client, release) => {
            await client.query(`INSERT INTO test (name) VALUES ('${req.body.add}')`);
            release();
            res.redirect('/info/get');
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/info/delete', (req, res) => {
    try {
        pool.connect( async (error, client, release) => {
            await client.query(`DELETE FROM test WHERE name = '${req.body.delete}'`);
            release();
            res.redirect('/info/get');
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/info/update', (req, res) => {
    try {
        pool.connect( async (error, client, release) => {
            await client.query(`UPDATE test SET name = '${req.body.newValue}' WHERE name = '${req.body.oldValue}'`);
            release();
            res.redirect('/info/get');
        })
    } catch (error) {
        console.log(error);
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})