const express = require('express')

const mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./model/User");
mongoose.connect("mongodb://0.0.0.0:27017/").then(()=>{
    console.log("connected")
}) .catch(err => console.log(err));

var path = require('path')
const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
  
app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/public', express.static('public'));
app.get('/', (req, res) => {
  res.render("Home",{
    message:""
  })
})
app.get('/word', (req, res) => {
    res.render("word")
  })


app.post("/login", async function(req, res){
    try {
        // check if the user exists
        const user = await User.findOne({ username: req.body.uemail });
        if (user) {
          //check if password matches
          const result = req.body.upassword === user.upassword;
          if (result) {
            res.render("Home",{
                message:"login successfull"
            });
          } else {
            res.render("Home",{
                message:"Password Didn't Match"
            });          }
        } else {
            res.render("Home",{
                message:"User Doesn't Exit"
            }); 
        }
      } catch (error) {
        res.status(400).json({ error });
      }
});

app.post("/signup", async (req, res) => {
    await User.create({
      username: req.body.uemail,
      password: req.body.upassword
    }).then((response)=>{
        res.render("Home",{
            message:"Sign In Successfull"
        })

    }).catch((err)=>{
        res.render("Home",{
            message:err.message
        })

    });

  });
  app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.render("Home",{
            message:"Logout Done"
          })
      });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})