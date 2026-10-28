import express from 'express';
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
 import 'dotenv/config'
const app = express();
const port =process.env.PORT|| 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connect
const uri = process.env.MONGO_DB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
//   Get database and collection
        const database = client.db("wonderlust_db_data");
        const destinationCollection = database.collection("destination")
async function run() {
    try {
        
        
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
      console.log("You are not successfully connected to MongoDB!")
  }
}
await run()

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// data-post
app.post("/add-destinations",async (req, res) => {
    const data = req.body;
    const result = await destinationCollection.insertOne(data);
    res.send(result)
})
// alldata-get
app.get("/destinations", async(req, res) => {
  const cursor = destinationCollection.find();
  const allData = await cursor.toArray();
  res.send(allData)
})
// detailsData
app.get("/destination/:id", async(req, res) => {
  const { id } =  req.params;
  const query = { _id: new ObjectId(id) };
  const result = await destinationCollection.findOne(query);
  res.send(result)
})

// updateData
app.patch("/destination/:id", async(req, res) => {
  const { id } = req.params;
  const data = req.body;
  const query = { _id: new ObjectId(id), };
  const result = await destinationCollection.updateOne(query, { $set: data })
  res.send(result)

})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});