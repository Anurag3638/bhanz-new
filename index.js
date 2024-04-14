const express = require("express");
const { join } = require("path");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const product = require("./model/model.js");
app.use(express.json());

mongoose.connect(
  "mongodb+srv://bhanzoff:!bhanz2@cluster0.x5vtn0y.mongodb.net/bhanzoff?retryWrites=false&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.engine("hbs", exphbs.create({ extname: ".hbs" }).engine);
app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.urlencoded({ extended: false }));

const staticWebsiteFolder = join(__dirname, "public");

app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(join(staticWebsiteFolder, "index.html"));
// });

app.get("/", async (req, res) => {
  const data = await product.find().limit(10).lean();
  res.render("layouts/main", { data} );
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
  let page = Number(req.query.page) || 1;
  let nextData = await product.find().skip((page-1)*10).limit(10).lean();
  let nextPage = page + 1;
  res.render("page2", { nextData , nextPage} );
  console.log(page);
});

app.get("/search", async (req, res) => {
  const search = await product.find(req.query);
  res.status(200).json({ search });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
