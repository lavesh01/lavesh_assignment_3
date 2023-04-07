const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app  = express();

app.use(express.json());
app.use(cors());


mongoose.set('strictQuery', false);

mongoose.connect( process.env.MONGODB_URL ,   
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
)   .then(()=>{
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });

    
const User = require("./models/User.js");

app.get("/users", async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/new/user", async (req,res) => {
    const userData = req.body;
    try {
      const user = new User(userData);
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

    
app.put("/update/user/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            name: req.body?.name,
            email: req.body?.email,
            address: {
              street: req.body.address?.street,
              suite: req.body.address?.suite,
              city: req.body.address?.city,
              zipcode: req.body.address?.zipcode,
              geo: {
                lat: req.body.address?.geo?.lat,
                lng: req.body.address?.geo?.lng
              }
            },
            phone: req.body?.phone,
            website: req.body?.website,
            company: {
              name: req.body?.company?.name,
              catchPhrase: req.body?.company?.catchPhrase,
              bs: req.body?.company?.bs
            },
            like: req.body?.like
          }      
        },
        { new: true } 
      );
  
      res.json(updatedUser);
    } catch (error) {
      res.json(error.message);
    }
  });
  

app.delete("/delete/user/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.json(error.message);
    }
})


app.listen(3001, () => console.log("Sever started!"));