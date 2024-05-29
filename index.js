const express = require("express");
const { join, extname } = require("path");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const product = require("./model/model.js");
const user = require("./model/user.js");
const { findOne } = require("./model/user.js");
app.use(express.json());

mongoose.connect(
  "mongodb+srv://bhanz:yfiQs05Sjy18GsEX@bhanzcollection.pn2vyao.mongodb.net/?retryWrites=true&w=majority&appName=bhanzcollection",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);


app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: join(__dirname, 'views/layouts'),
  extname: '.hbs'
}));
app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));

const staticWebsiteFolder = join(__dirname, "public");

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(join(staticWebsiteFolder, "index.html"));
// });

app.get("/", async (req, res) => {
  const data = await product.find().limit(10).lean();
  res.render("index", { data} );
});

app.get("/api/v/products", (req, res) => {
  res.sendFile(join(staticWebsiteFolder, "addproduct.html"));
});

app.post("/api/v/products", async (req, res) => {
  try {
    console.log(req.body);
    const newProduct = new product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
      price: req.body.price,
    });
    const postData = await newProduct.save();
    console.log(postData);
    res.sendFile(join(staticWebsiteFolder, "addproduct.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving the user data.");
  }
});

app.get("/next", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const nextData = await product.find().skip((page - 1) * 10).limit(10).lean();
    let nextPage = page+1;
    let prevPage =  page-1;
    res.render("pages", { nextData, nextPage, prevPage });

  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the data.");
  }
});

app.get("/signup", (req,res)=>{
  res.sendFile(join(staticWebsiteFolder, "signup.html"));
});

app.post('/signup', async (req, res) => {
  try {
    // Create a new user document
    const newUser = new user({
      username : req.body.username,
      email : req.body.email,
      phone : req.body.phone,
      password : req.body.password,
    });

    // Save the new user document to the database
    const userData = await newUser.save();

    console.log(userData);
    res.render('index'); // or any other response as needed
  } catch (error) {
    // Check if the error is due to duplicate key
    if (error.code === 11000 && error.keyPattern.name === 1) {
      console.error("Duplicate key error: Name already exists.");
      res.status(400).send(error);
    } else {
      console.error(error);
      res.status(500).send('An error occurred while saving the user data.');
    }
  }
});


app.get("/login", (req, res) => {
  res.sendFile(join(staticWebsiteFolder, "login.html"));
});

app.post('/login', async (req, res) => {
  try {
    const { username , password } = req.body;

    // Check if a user with the provided email and password exists
    const checkuser = await user.findOne({ username, password });
    if (!checkuser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If the email and password are correct, send a success response
    res.render("userlogged", {username});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/search", async (req, res) => {
  const search = await product.find(req.query);
  res.status(200).json({ search });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
