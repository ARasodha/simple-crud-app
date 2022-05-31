const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const {Pool} = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();
const Mongoosedata = require('./models/mongodata');
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })

const pool = new Pool();
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

const PORT = process.env.PORT;

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

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

app.get('/mongodata', async (req, res) => {
  try {
    const data = await Mongoosedata.find();
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
  
})

app.post('/mongodata', getMongoosedata, async (req, res) => {
  const mongoosedata = new Mongoosedata({
    name: req.body.name,
    age: req.body.age
  })

  try {
    const newMongooseData = await mongoosedata.save();
    res.status(201).send(newMongooseData);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.patch('/mongodata/:id', getMongoosedata, async (req, res) => {
  if (req.body.name != null) {
    res.mongoosedata.name = req.body.name
  }

  if (req.body.age != null) {
    res.mongoosedata.age = req.body.age
  }

  try {
    const updatedMongoosedata = await res.mongoosedata.save()
    res.json(updatedMongoosedata)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete('/mongodata/:id', getMongoosedata, async (req, res) => {
  try {
    await res.mongoosedata.remove()
    res.json({ message: 'Mongoosedata deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

async function getMongoosedata(req, res, next) {
  let mongoosedata;
  try {
      mongoosedata = await Mongoosedata.findById(req.params.id)
      if (mongoosedata == null) {
          return res.status(404).json({ message: 'Cannot find mongoosedata with specified id'});
      }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

  res.mongoosedata = mongoosedata;
  next()
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})