const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
    app.get("/allservices/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const singleService = await reviewsCollection.findOne(query);
      console.log(singleService);

      res.send(singleService);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const result = reviewsCollection.find(query);
      const rivews = await result.toArray();
      res.send(rivews);
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
