/*
  app.js -- This creates an Express webserver
*/


// First we load in all of the packages we need for the server...
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
//const bodyParser = require("body-parser");
const axios = require("axios");
var debug = require("debug")("personalapp:server");

// Now we create the server
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbya789fds89snana789sdfa",
    resave: false,
    saveUninitialized: false
  })
);

//app.use(bodyParser.urlencoded({ extended: false }));

// This is an example of middleware
// where we look at a request and process it!
app.use(function(req, res, next) {
  //console.log("about to look for routes!!! "+new Date())
  console.log(`${req.method} ${req.url}`);
  //console.dir(req.headers)
  next();
});

// here we start handling routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/demo",
        function (req, res){res.render("demo");});

app.get("/about", (request, response) => {
  response.render("about");
});

app.get("/quiz1", (request, response) => {
  response.render("quiz1");
});

app.get("/grading", (request, response) => {
  response.render("grading");
});

app.get("/form", (request,response) => {
  response.render("form")
})

app.post("/showformdata", (request,response) => {
  response.json(request.body)
})

app.get("/form2", (request,response) => {
  response.render("form2")
})


app.post("/showNameAge", (request,response) => {
  response.locals.name=request.body.fullname
  response.locals.age =request.body.age
  response.render("form2data")
})



app.post("/reflectFormData",(req,res) => {
  res.locals.title = "Form Demo Page"
  res.locals.name = req.body.fullname
  res.locals.body = req.body
  res.locals.demolist = [2,3,5,7,11,13]
  res.render('reflectData')
})



app.get("/dataDemo", (request,response) => {
  response.locals.name="Tim Hickey"
  response.locals.vals =[1,2,3,4,5]
  response.locals.people =[
    {'name':'Tim','age':65},
    {'name':'Yas','age':29}]
  response.render("dataDemo")
})

app.get("/triangleArea", (request,response) => {
  response.render("triangleArea")
})

app.post('/calcTriangleArea', (req,res) => {
  const a = parseFloat(req.body.a) // converts form parameter from string to float
  const b = parseFloat(req.body.b)
  const c = parseFloat(req.body.c)
  const s = (a+b+c)/2
  const area = Math.sqrt(s*(s-a)*(s-b)*(s-c))
  res.locals.a = a
  res.locals.b = b
  res.locals.c = c
  res.locals.area = area
  //res.json({'area':area,'s':s})
  res.render('showTriangleArea')
})

app.get("/restaurant", (request,response) => {
  response.render("restaurant")
})

app.post('/restaurantHelper', (req,res) => {
  const mealCost = parseFloat(req.body.mealCost)
  const tipRate = parseFloat(req.body.tipRate)
  const numGuests = parseFloat(req.body.numGuests)
  const costPerPerson=
     ((mealCost + (mealCost * (tipRate / 100))) / numGuests).toFixed(2)
  res.locals.mealCost = mealCost
  res.locals.tipRate = tipRate
  res.locals.numGuests = numGuests
  res.locals.costPerPerson = costPerPerson
  res.render('restaurantCost')
})

let todoItems = []

app.get('/todo', (req,res) => {
  res.locals.todoItems = todoItems
  res.render('todo')
})

app.post('/storeTodo',(req,res) => {
  const todoitem = req.body.todoitem
  todoItems = todoItems.concat({'todo':todoitem})
  console.log("Inside storeTodo")
  console.dir(todoItems)  // debug step ..
  res.locals.todoItems = todoItems
  res.render('todo')
})

// Here is where we will explore using forms!



// this example shows how to get the current US covid data
// and send it back to the browser in raw JSON form, see
// https://covidtracking.com/data/api
// for all of the kinds of data you can get
app.get("/c19",
  async (req,res,next) => {
    try {
      const url = "https://covidtracking.com/api/v1/us/current.json"
      const result = await axios.get(url)
      res.json(result.data)
    } catch(error){
      next(error)
    }
})

// this shows how to use an API to get recipes
// http://www.recipepuppy.com/about/api/
// the example here finds omelet recipes with onions and garlic
app.get("/omelet",
  async (req,res,next) => {
    try {
      const url = "http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=3"
      const result = await axios.get(url)
      res.json(result.data)
    } catch(error){
      next(error)
    }
})

app.get('/art', (req,res) => {
  res.render('art')
})

app.post("/artFun",
  async (req,res,next) => {
    try {
      const food = req.body.art
      const url = "https://api.artic.edu/api/v1/artworks"+art+"&p=1"
      const result = await axios.get(url)
      // console.dir(result.data)
      // console.log('results')
      // console.dir(result.data.results)
      res.locals.results = result.data.results
      //res.json(result.data)
      res.render('artFunShow')
    } catch(error){
      next(error)
    }
})

// Don't change anything below here ...

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Here we set the port to use
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
