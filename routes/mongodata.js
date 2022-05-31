const express = require('express');
const router = express.Router();
const Mongoosedata = require('../models/mongodata');

//getting all 
router.get('/', async (req, res) => {
  try {
    const data = await Mongoosedata.find();
    res.send(data);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
  
})

// creating one
router.post('/', getMongoosedata, async (req, res) => {
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
// updating one
router.patch('/:id', getMongoosedata, async (req, res) => {
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

// deleting one
router.delete('/:id', getMongoosedata, async (req, res) => {
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

module.exports = router;