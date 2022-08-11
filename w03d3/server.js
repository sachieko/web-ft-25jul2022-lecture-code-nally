const express = require("express");
const PORT = 8082;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine","ejs");

// public folder for static files
app.use(express.static("public"));

//
// Users Data
//
const users = {
  'nally': "qwerty",
  'monkey': "fuzz"
};

//
// Middleware
//

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

//
// Routes
//

app.get('/',(req,res)=>{
  res.render('homepage');
});

// Login Routes

app.get('/login',(req,res)=>{
  res.render("login");
});

// login submit handler
app.post("/login",(req,res)=>{
  console.log("login req.body:",req.body);
  const testName = req.body.username;
  const testPassword = req.body.password;
  if (users[testName] && users[testName] === testPassword){ // the user is authentic
    res.cookie("user",testName);
    res.redirect("/profile");
    // res.end();
  } else {
    res.redirect("/login");
  }
});

// Registration Routes

app.get('/register',(req,res)=>{
  res.render("register");
});

// registeration submit handler
app.post("/register",(req,res)=>{
  console.log("register req.body:",req.body);
  const newName = req.body.username;
  const newPassword = req.body.password;

  users[newName] = newPassword;
  res.cookie("user",newName);

  res.redirect("/profile");
});


// Profile Page
app.get('/profile',(req,res) => {
  console.log("req.cookies:",req.cookies);
  
  if (users[req.cookies.user]) { // if the user is authenticated
    const templateVars = { 
      user: req.cookies.user, 
      password: users[req.cookies.user ] 
    };
    res.render('profile', templateVars);
    return;
  } 

  res.redirect('/login');
  return;
});

app.post("/profile", (req,res) => {
  console.log("profile req.body:",req.body);
  const newPassword = req.body.newpassword;
  users[req.cookies.user] = newPassword;
  res.redirect('/');
});

// Logout Route
app.get("/logout",(req,res)=>{
  res.clearCookie("user");
  res.redirect("/");
});

app.listen(PORT,"localhost", ()=>{
  console.log(`Server is listening on port ${PORT}`);
});
