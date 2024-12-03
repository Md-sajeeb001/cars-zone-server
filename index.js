require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// MIDDLE WARE !

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.CAR_NAME}:${process.env.CAR_PASS}@cluster0.e4qpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const CarCollection = client.db("carsDB").collection("cars");
    const userCollection = client.db("carsDB").collection("users");

    app.get("/cars", async (req, res) => {
      const cursor = CarCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await CarCollection.findOne(quary);
      res.send(result);
    });

    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      const result = await CarCollection.insertOne(newCar);
      res.send(result);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updated = req.body;
      const car = {
        $set: {
          name: updated.name,
          price: updated.price,
          category: updated.category,
          photo: updated.photo,
          speed: updated.speed,
        },
      };
      const result = await CarCollection.updateOne(quary, car, options);
      res.send(result);
    });

    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await CarCollection.deleteOne(quary);
      res.send(result);
    });

    // user relatd apis!

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const quary = userCollection.find();
      const result = await quary.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(quary);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(quary);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("data coming soon");
});

app.listen(port, () => {
  console.log(`server running port on : ${port}`);
});
