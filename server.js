const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const ResourceModel = require("./models/ResourceModel");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
require("dotenv").config();

const uri =
  "mongodb+srv://demo-connect:qzIqV1ZadAaVnGPy@cluster0.hwnk6d6.mongodb.net/?retryWrites=true&w=majority";

//connecting to the monngodb
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

//getting all the data
app.get("/api/resources", async (req, res) => {
  const resource = await ResourceModel.find();
  res.send(resource);
});

//creating new data
app.post("/api/resources", async (req, res) => {
  const { title, description, map, url } = req.body;

  const newResource = new ResourceModel({
    title,
    description,
    map,
    url,
  });

  await newResource.save();
  res.send(newResource);
});

//getting single resource
app.get("/api/resources/:id", async (req, res) => {
  try {
    const data = await ResourceModel.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//updating

app.put("/api/resources/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send(`Invalid ID: ${id}`);
  }

  //update the document
  ResourceModel.findByIdAndUpdate(id, body, { new: true })
    .then((doc) => {
      if (!doc) {
        return res.status(404).send(`Document not found with ID: ${id}`);
      }
      res.send(doc);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server Error");
    });
});

//deleting
app.delete("/api/resources/:id", (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send(`Invalid ID: ${id}`);
  }
  ResourceModel.findByIdAndRemove(id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).send(`Document not found with ID: ${id}`);
      }
      res.send(`Document remove with ID ${id}`);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send("Server error");
    });
});

//running the port
app.listen(8000, () => {
  console.log("Server started on port 8000");
});
