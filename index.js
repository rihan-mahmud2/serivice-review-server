const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vjq6aig.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const reviewsCollection = client.db("clientRivews").collection("rivews");
    const clientRealRivews = client
      .db("clientRivews")
      .collection("clientRealRivews");

    // implementing jwt token

    app.post("/jwt", (req, res) => {
      const user = req.body;
      jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const result = reviewsCollection.find(query);
      const services = await result.limit(3).toArray();
      res.send(services);
    });

    app.get("/allservices", async (req, res) => {
      const query = {};
      const result = reviewsCollection.find(query);
      const services = await result.toArray();
      res.send(services);
    });

    app.post("/allservices", async (req, res) => {
      const service = req.body;
      const result = await reviewsCollection.insertOne(service);
      console.log(result);
      res.send(result);
    });
    app.get("/allservices/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const singleService = await reviewsCollection.findOne(query);

      res.send(singleService);
    });

    app.get("/reviews/:index", async (req, res) => {
      const name = parseInt(req.params.index);
      console.log(name);
      const query = { index: name };
      const result = clientRealRivews.find(query);
      const rivews = await result.toArray();
      res.send(rivews);
    });
    app.post("/rivews", async (req, res) => {
      const rivews = req.body;
      const result = await clientRealRivews.insertOne(rivews);
      res.send(result);
    });

    app.get("/rivews", async (req, res) => {
      const userEmail = req.query.email;
      console.log(userEmail);
      const query = { email: userEmail };
      const result = clientRealRivews.find(query);
      const rivews = await result.toArray();
      console.log(rivews);
      res.send(rivews);
    });

    app.delete("/rivews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const resutl = await clientRealRivews.deleteOne(query);
      res.send(resutl);
    });
  } catch {}
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("The server is running");
});

app.get("/services");

app.listen(port, () => {
  console.log("The server is listning on", port);
});
