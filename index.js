const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const database = client.db("Disney_Empire");

    app.get("/", async (req, res) => {
      const exhibitionToys = await database
        .collection("ExhibitionToys")
        .find()
        .toArray();
      res.send(exhibitionToys);
    });

    app.get("/all_toy", async (req, res) => {
      const allToy = database.collection("Toys");
      const cursor = allToy.find().limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/all_toy/:category", async (req, res) => {
      const category = req.params.category;
      const allToy = database.collection("TabsToys");
      const query = { category };
      const cursor = allToy.find(query).limit(2);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my_toys/:email", async (req, res) => {
      const email = req.params.email;
      const query = { sellerEmail: email };
      const myToys = database.collection("Toys").find(query);
      const result = await myToys.toArray();
      res.send(result);
    });

    app.post("/add_toy", async (req, res) => {
      const toy = database.collection("Toys");
      const toy_details = req.body;
      const result = await toy.insertOne(toy_details);
      res.send(result);
    });
  } catch {
    await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
