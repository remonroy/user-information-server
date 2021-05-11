const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId
require('dotenv').config();

// console.log(process.env.DB_USER)


const app = express()
const port = 4000
app.use(cors())
app.use(express.json())




const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxd1m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("jobPrepar").collection("data");

    app.post("/infopost",(req,res)=>{
        const info=req.body;
        collection.insertOne(info)
        .then(result=>{
            res.send(result.insertedCount > 0);
        })
    })
    app.get("/showData",(req,res)=>{
        collection.find({})
        .toArray((error,document)=>{
            res.send(document);
        })
    })

    app.delete('/delete/:id',(req,res)=>{
        const idinfo=req.params.id;
        // console.log(idinfo);
        collection.deleteOne({_id:ObjectId(idinfo)})
        .then(document=>{
          res.send(document.deletedCount > 0);
        })
    })

    app.get('/update/:id',(req,res)=>{
        const idinfo=req.params.id;
        collection.find({_id:ObjectId(idinfo)})
        .toArray((error,document)=>{
            res.send(document);
        })
    })
    
    app.patch('/updateFild',(req,res)=>{
        collection.updateOne({_id: ObjectId(req.body.id)},
        {
          $set:{firstName:req.body.status,lastName:req.body.lastName,email:req.body.email}
        })
        .then(result=>{
          res.send(result.modifiedCount>0)
        })
    
    });


});



app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(process.env.PORT || port)