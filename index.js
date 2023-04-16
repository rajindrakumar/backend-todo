// AUTHENTICATION

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  
  // comparing the user given password to the encoded password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword, // using hasshedpassword 
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is working");
});


 





// .......................................................................
// import { name } from "ejs";
// import express from "express";
// import path from "path";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";

// //connecting the mongodb to the server
// mongoose.connect("mongodb://127.0.0.1:27017", {
//     dbName:"backend",
// }).then(()=>console.log("Database is connected")).catch((e)=>console.log(e));


// //creating the schema
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
// });

// //creating the model(collection)
// const User = mongoose.model("User", userSchema);



// const app = express();



// // to acess the static file , we use "Use" Method

// //using middlewares
// app.use(express.static(path.join(path.resolve(), "public")));
// app.use(express.urlencoded({extended:true}));

// //using cookie parser
// app.use(cookieParser());
 
// //setting up view engine
// app.set("view engine", "ejs"); // we can set it or we can write index.js


// //middleware / this is the function for authentication
// const isAuthenticated = (req,res, next)=>{
//     const { token } = req.cookies;

//     if(token){ 
//        next();
//     }
//     else{
//         res.render("login");
//     }

// }

// app.get("/", isAuthenticated, (req,res) =>{
//     res.render("logout");
// })

// //creating the login api 
// // to acess the cookies , we have to press login and also  we have reload the page
// app.post("/login",isAuthenticated, async (req,res)=>{
//     const {name, email} = req.body;

//     const user  = await User.create({
//         name,email,
//     });

//     res.cookie("token", user._id,{
//         httpOnly: true,
//         expires: new Date(Date.now()+ 60 * 1000)
//     });
//     res.redirect("/");
// })

// app.get("/logout", (req,res)=>{ 
//     res.cookie("token", null,{
//         httpOnly:true,
//         expires:new Date(Date.now())
//     });
//     res.redirect("/");
// })

 


// app.listen(5000, ()=>{
//     console.log("server is working");
// });





//........................................................................

// -FROM below CODE , WE WILL GENERATE LOGIN,LOGOUT, AND THE CONDITION IS THAT , IF THERE IS COOKIE, THEN LOGOUT, IF THERE IS NO COOKIE THEN LOGIN 
// import { name } from "ejs";
// import express from "express";
// import path from "path";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";

// //connecting the mongodb to the server
// mongoose.connect("mongodb://127.0.0.1:27017", {
//     dbName:"backend",
// }).then(()=>console.log("Database is connected")).catch((e)=>console.log(e));

// //creating the schema
// const messageSchema = new mongoose.Schema({
//     name: String,
//     email: String,
// });

// //creating the model(collection)
// const Messge = mongoose.model("Message", messageSchema);



// const app = express();



// // to acess the static file , we use "Use" Method

// //using middlewares
// app.use(express.static(path.join(path.resolve(), "public")));
// app.use(express.urlencoded({extended:true}));

// //using cookie parser
// app.use(cookieParser());
 
// //setting up view engine
// app.set("view engine", "ejs"); // we can set it or we can write index.js



// //creating the login api 
// app.get("/", (req,res) =>{ // <--this is called the handler

//     // console.log(req.cookies); // it will print null in terminal if i reload the page of login
//     // console.log(req.cookies.token); // we can get the token by this method also, but we use down method

//     const {token} = req.cookies; // this is method in which we get the cookies value

//     if(token){
//         res.render("logout");
//     }
//     else{
//         res.render("login")
//     }
// });


// // to acess the cookies , we have to press login and also  we have reload the page
// app.post("/login", (req,res)=>{
//     res.cookie("token", "iamin",{
//         httpOnly:true,
//         expires:new Date(Date.now()+60*1000)
//     });
//     res.redirect("/");
// })

// app.get("/logout", (req,res)=>{
//     res.cookie("token", null,{
//         httpOnly:true,
//         expires:new Date(Date.now())
//     });
//     res.redirect("/");
// })

// // app.post("/",(req,res)=>{
// //     console.log(req.body);
// //     // console.log(req.body.name);
// //     // console.log(req.body.email);
// // })

// // if we want to display the output in another directory then we can use this


// // app.get("/add",(req,res)=>{

// //     Messge.create({name:"Rajindra", email:"rajindra@gmail.com"}).then(()=>{
// //         res.send("Nice");
// //     });

// // });

// // -- THIS IS THE METHOD , WHEN WE USE TO PUSH THE DATA MANUALLY
// // In the place of then function , we can use async and await key
// // app.get("/add", async (req,res)=>{

// //     await Messge.create({name:"Rajindra", email:"rajindra@gmail.com"}).then(()=>{
// //         res.send("Nice");
// // // this nice will be shown in localhost:5000/add, so get here the created data, we have to reload the the localhost, how much you reload , that time the data is sent to the compass

// //     });

// // });

// app.get("/success", (req,res) =>{
//     res.render("success" );
// });

// // down you can see the action ="/contact"

// // we use down code for render so it is known as route
// // app.post("/contact", (req,res)=>{
// //     console.log(req.body.name);

// //     users.push({username:req.body.name, email: req.body.email});
// //     // by render method , we can display the sucess data in to the localhost:5000 
// //     // res.render("success"); 

// //     // this method redirect the all the data to the localhost:5000/success

// //     res.redirect("/success");
// // })

// // CREATING THE DATABASE , WHICH WILL SEND THE DATA FROM THE CONTACT PAGE TO THE COMPASS

// app.post("/contact", async (req,res)=>{
  
//     //we are using the req.body again and agin , so we can shortcut it 
//     // await Messge.create({ name:req.body.name, email: req.body.email});

//     const {name,email} = req.body;

//     // these have the value pair same , so we can directly write the {name,email}
//     // await Messge.create({ name:name, email: email});


//     await Messge.create({ name, email});
     
//     res.redirect("/success");
// })

// // Making the api for storing the form data in array
// // down we use it manupulate the data , so we can call it as API
// app.get("/users",(req,res) =>{
//     res.json({
//         users,
//     })
// })


// app.listen(5000, ()=>{
//     console.log("server is working");
// });








//.......................................................................
// ---CODE FOR CREATING THE DATABASE 

// // express make our code so optimal (shorts )

// import { name } from "ejs";
// import express from "express";
// import path from "path";
// import mongoose from "mongoose";

// //connecting the mongodb to the server
// mongoose.connect("mongodb://127.0.0.1:27017", {
//     dbName:"backend",
// }).then(()=>console.log("Database is connected")).catch((e)=>console.log(e));

// //creating the schema
// const messageSchema = new mongoose.Schema({
//     name: String,
//     email: String,
// });

// //creating the model(collection)
// const Messge = mongoose.model("Message", messageSchema);



// const app = express();



// // to acess the static file , we use "Use" Method

// //using middlewares
// app.use(express.static(path.join(path.resolve(), "public")));
// app.use(express.urlencoded({extended:true}));

// //setting up view engine
// app.set("view engine", "ejs"); // we can set it or we can write index.js

// app.get("/", (req,res) =>{
//     res.render("index" , {name:"rajindra"});
// });

// // app.post("/",(req,res)=>{
// //     console.log(req.body);
// //     // console.log(req.body.name);
// //     // console.log(req.body.email);
// // })

// // if we want to display the output in another directory then we can use this


// // app.get("/add",(req,res)=>{

// //     Messge.create({name:"Rajindra", email:"rajindra@gmail.com"}).then(()=>{
// //         res.send("Nice");
// //     });

// // });

// // -- THIS IS THE METHOD , WHEN WE USE TO PUSH THE DATA MANUALLY
// // In the place of then function , we can use async and await key
// // app.get("/add", async (req,res)=>{

// //     await Messge.create({name:"Rajindra", email:"rajindra@gmail.com"}).then(()=>{
// //         res.send("Nice");
// // // this nice will be shown in localhost:5000/add, so get here the created data, we have to reload the the localhost, how much you reload , that time the data is sent to the compass

// //     });

// // });

// app.get("/success", (req,res) =>{
//     res.render("success" );
// });

// // down you can see the action ="/contact"

// // we use down code for render so it is known as route
// // app.post("/contact", (req,res)=>{
// //     console.log(req.body.name);

// //     users.push({username:req.body.name, email: req.body.email});
// //     // by render method , we can display the sucess data in to the localhost:5000 
// //     // res.render("success"); 

// //     // this method redirect the all the data to the localhost:5000/success

// //     res.redirect("/success");
// // })

// // CREATING THE DATABASE , WHICH WILL SEND THE DATA FROM THE CONTACT PAGE TO THE COMPASS

// app.post("/contact", async (req,res)=>{
  
//     //we are using the req.body again and agin , so we can shortcut it 
//     // await Messge.create({ name:req.body.name, email: req.body.email});

//     const {name,email} = req.body;

//     // these have the value pair same , so we can directly write the {name,email}
//     // await Messge.create({ name:name, email: email});


//     await Messge.create({ name, email});
     
//     res.redirect("/success");
// })

// // Making the api for storing the form data in array
// // down we use it manupulate the data , so we can call it as API
// app.get("/users",(req,res) =>{
//     res.json({
//         users,
//     })
// })


// app.listen(5000, ()=>{
//     console.log("server is working");
// });
