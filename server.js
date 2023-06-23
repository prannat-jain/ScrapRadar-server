//handle apis
const express = require("express");
//handle db
const mongoose = require("mongoose");
//handle cors
const cors = require("cors");

//invoking express and cors app
const app = express();
app.use(express.json());

app.use(cors());

const uri =
  "mongodb+srv://prannat:prannat.123@cluster0.1wwdrvu.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongoDB"))
  .catch(console.error);

app.listen(3001, () => console.log("Server started on port 3001"));

//import created model for db
const SaleInventory = require("./models/SaleInventory");

//make a request to localhost:3001/saleinventory, find the inventory and pass it to the constant as the result
app.get("/saleinventory", async (req, res) => {
  const saleinventory = await SaleInventory.find();

  res.json(saleinventory);
});

//adding inventory items by app.post
app.post("/saleinventoryitem/new", (req, res) => {
  const saleinventoryitem = new SaleInventory({
    //passing through the input text and creating a saleinventory item
    text: req.body.text,
  });

  saleinventoryitem.save();

  res.json(saleinventoryitem);
});

//deleting by id
app.delete("/saleinventoryitem/delete/:itemID", async (req, res) => {
  //mongoose method to find by id and delete
  const result = await SaleInventory.findByIdAndDelete(req.params.itemID);

  res.json(result);
});

//updating by id, for example marking item as sold....note: can be done with put and get
//with put here, just add method: "PUT" in the fetch request
app.put("/saleinventoryitem/sold/:itemID", async (req, res) => {
  const saleinventoryitem = await SaleInventory.findById(req.params.itemID);

  //if item is still available, mark it as sold or vica versa
  saleinventoryitem.stillAvailable = !saleinventoryitem.stillAvailable;

  saleinventoryitem.save();

  res.json(saleinventoryitem);
});

//setup to run client from node.js itself using the build
const path = require("path");

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");

app.use(express.static(buildPath));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});
