const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  amount: Number
});

const ShoppingItem = mongoose.model('ShoppingItem', ShoppingItemSchema);

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await ShoppingItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  const item = new ShoppingItem(req.body);
  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT and DELETE routes here...

module.exports = app;