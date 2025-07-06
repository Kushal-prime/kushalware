const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const url = 'mongodb://localhost:27017';
const dbName = 'kushalwear';

async function connectToDB() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(dbName);
    } catch (err) {
        console.error(err);
    }
}

app.get('/api/cart', async (req, res) => {
    const db = await connectToDB();
    const cartItems = await db.collection('cart').find().toArray();
    res.json(cartItems);
});

app.post('/api/cart', async (req, res) => {
    const db = await connectToDB();
    const result = await db.collection('cart').insertOne(req.body);
    res.json(result.ops[0]);
});

app.delete('/api/cart/:id', async (req, res) => {
    const db = await connectToDB();
    const result = await db.collection('cart').deleteOne({ id: parseInt(req.params.id) });
    res.json({ success: result.deletedCount > 0 });
});

app.listen(3000, () => console.log('Server running on port 3000'));

// Install dependencies: npm init -y && npm install express mongodb cors