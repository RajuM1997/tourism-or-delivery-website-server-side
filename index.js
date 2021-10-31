const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();

const port = process.env.PORT || 4500;

//TravelBea
//5t4X5c2rdnkVVpk1

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyrha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tour_pack");
    const packageCollection = database.collection("package");
    const orderCollection = database.collection("order");

    //CREATE A ORDER APLI
    app.post("/package", async (req, res) => {
      const data = req.body;
      const result = await packageCollection.insertOne(data);
      res.send(result);
    });

    //GET THE API
    app.get("/package", async (req, res) => {
      const result = await packageCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //CREATE A DYNMICE API
    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await packageCollection.findOne(query);
      res.json(service);
    });

    //CREATE A ORDER APLI
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    //GET THE ORDER API
    app.get("/order", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //DELETE THE ORDER API
    app.delete("/deleteOrder/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //my order get api with email
    app.get("/myOrder/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    //DELETE THE ORDER API
    app.delete("/myOrder/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("node server running");
});
app.listen(port, () => {
  console.log("server is running port", port);
});
