const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB}:${process.env.password}@cluster0.hwuf8vx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {




        const database = client.db("roommateFinderDB");
        const roommateCollection = database.collection("roommates");



        app.post("/api/roommates", async (req, res) => {
            const data = req.body;
            data.likeCount = 0;
            data.likedUsers = [];
            data.createdAt = new Date()
            const result = await roommateCollection.insertOne(data);
            res.send({ message: "Roommate post created", result });
        });



        // Get roommates with optional limit and filter by available
        app.get("/api/roommates", async (req, res) => {
            let limit = parseInt(req.query.limit) || 0;
            const availability = req.query.availability;


            const filter = {};
            if (availability === "true") {
                filter.availability = "Available";
            } else if (availability === "false") {
                filter.availability = "Not Available";
            }

            const roommates = await roommateCollection.find(filter).sort({ createdAt: -1 }).limit(limit).toArray();

            res.send(roommates);
        });



        app.get("/api/all-roommates", async (req, res) => {
            const result = await roommateCollection.find({}).sort({ createdAt: -1 }).toArray()
            res.send(result)
        });




        app.get("/api/roommates/:id", async (req, res) => {
            const { id } = req.params;
            const email = req.query.email;

            const post = await roommateCollection.findOne({ _id: new ObjectId(id) });

            const canSeeContact = post.likedUsers?.includes(email);
            if (!canSeeContact) {
                delete post.contact;
            }

            res.send(post);
        });







        app.get("/api/my-roommates", async (req, res) => {
            const email = req.query.email;

            if (!email) {
                return res.status(400).send({ message: "Email is required" });
            }

            const result = await roommateCollection.find({ email }).toArray();
            res.send(result);
        });




        app.patch("/api/roommates/:id", async (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;

            const result = await roommateCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );

            res.send({ message: "Roommate post updated", result });
        });



        app.delete("/api/roommates/:id", async (req, res) => {
            const { id } = req.params;

            const result = await roommateCollection.deleteOne({ _id: new ObjectId(id) });

            res.send({ message: "Roommate post deleted", result });
        });






        app.patch("/api/roommates/:id/like", async (req, res) => {
            const { id } = req.params;
            const { email } = req.body;

            if (!email) {
                return res.status(400).send({ message: "Email is required" });
            }

            const post = await roommateCollection.findOne({ _id: new ObjectId(id) });

            if (!post) {
                return res.status(404).send({ message: "Post not found" });
            }


            if (post.email === email) {
                return res.status(403).send({ message: "You cannot like your own post" });
            }

            if (post.likedUsers?.includes(email)) {
                return res.status(409).send({ message: "Already liked" });
            }

            const result = await roommateCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $inc: { likeCount: 1 },
                    $addToSet: { likedUsers: email },
                }
            );

            res.send({ message: "Liked successfully", result });
        });






        // get normal 

        app.get("/api/v2/roommates/:id", async (req, res) => {
            const { id } = req.params;


            const post = await roommateCollection.findOne({ _id: new ObjectId(id) });

            if (!post) {
                return res.status(404).json({ message: "Roommate not found" });
            }

            res.json(post);

        });



        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
