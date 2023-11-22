const express = require('express');
const app = express();
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 2700;

const path=require("path");
const cors = require('cors');

mongoDbUrl= "mongodb://127.0.0.1:27017/Rasta"

mongoose.connect(mongoDbUrl).then(db =>{

    console.log('MONGO connected');

}).catch(error=> console.log(error));
mongoose.set('strictQuery', false);
module.exports=app;
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
const metaDatas=require("./src/routes/metaData")
app.use('/',metaDatas)
const metaData=require('./src/models/metaData')

app.get('/details', async (req, res) => {
    try {
      const groupedWayIds = await metaData.aggregate([
        {
          $unwind: '$geometry.elements' 
        },
        {
          $group: {
            _id: '$geometry.wayId',
            names: { $addToSet: '$geometry.elements.tags.name' },
            coordinates: { $push: '$geometry.coordinates' },
          },
        },
      ]);
      const result = groupedWayIds.map((group) => ({
        wayId: group._id,
        names: group.names,
        coordinates: group.coordinates,
      }));
      res.json(result);
    } catch (error) {
      res.json({ error: error.message });
    }
  });  

  

app.listen(PORT, () => console.log('Application is running'))