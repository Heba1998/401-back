'use strict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");

const PORT =process.env.PORT;

mongoose.connect(process.env.MONGODB,{ useNewUrlParser: true , useUnifiedTopology : true});

// test home
app.get ('/' , (req ,res)=>{
res.send('backend side from Heba 👏');
})

app.listen(PORT,()=>{
    console.log(`listen to the ${PORT}`)
})

class Flower {
    constructor(item){
        this.name=item.name;
        this.img=item.photo;
this.description=item.instructions
    }
}


const flowerSchema = new mongoose.Schema({
    name:String,
    img:String,
description:String
});

const userModel = new mongoose.Schema({
   email:String,
  data:[flowerSchema]
});

const favModel =mongoose.model('user', userModel);


function seedCollection(){
    let Heba = new favModel({
        email: 'hebaalmomani1998@gmail.com',

        data:[
            {
                name:"Azalea",
                img:"https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
                description:"Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5."
            }
        ]
    })

    let Tamim = new favModel({
        email: 'tamim.hamoudi@gmail.com',

        data:[
            {
                name:"Tibouchina Semidecandra",
                img:"https://upload.wikimedia.org/wikipedia/commons/b/bf/Flower_in_Horton_Plains_1.jpg",
                description:"Beautiful large royal purple flowers adorn attractive satiny green leaves that turn orange\\/red in cold weather. Grows to up to 18 feet, or prune annually to shorten."
            }
        ]
    })

    Heba.save();
    Tamim.save();
}
// seedCollection();




app.get('/api', getApiData);
app.get('/fav', getFavData);
app.post('/fav', AddFavData);
app.delete('/fav/:id', deleteFavData);
app.put('/fav/:id', updateFavData);

async function getApiData(req, res){
    const url = 'https://flowers-api-13.herokuapp.com/getFlowers'
    const apiData= await axios.get(url);
    const allData=apiData.data.map(item=>{
        return new Flower(item);
    })
    res.send(allData)
}

function getFavData(req,res){
    const email = req.query.email;
    favModel.findOne({email:email}, (error,user)=>{
        res.send(user);
    }) 
}

function AddFavData(req, res){
    const {email, name, img, description} = req.body;
    favModel.findOne({email:email}, (error,user)=>{
        const newFav={
            name:name,
            img:img,
        description:description   
        }
        user.data.push(newFav);
        user.save();
        res.send(user.data);
    })
}

function deleteFavData(req, res){
    const email = req.query.email;
    const index = Number(req.params.id);

    favModel.findOne({email:email}, (error,user)=>{
        user.data.splice(index,1);
        user.save();
        res.send(user.data);
    })
}

function updateFavData(req, res){
    const {email, name, img, description} = req.body;
    const index = Number(req.params.id);
    favModel.findOne({email:email}, (error,user)=>{
        const newFav={
            name:name,
            img:img,
        description:description   
        }
        user.data.splice(index,1, newFav);
        user.save();
        res.send(user.data);
    })
}