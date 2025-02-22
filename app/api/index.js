const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Connect to MongoDB with error handling
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Successfully connected to MongoDB.')
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error)
})

// Add mongoose connection error handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// Define the shopping item schema
const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  amount: Number,
})

const ShoppingItem = mongoose.model("ShoppingItem", ShoppingItemSchema)

// API Routes with error handling
app.get("/api/items", async (req, res) => {
  try {
    const items = await ShoppingItem.find()
    console.log('Retrieved items:', items) // Add logging
    res.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ error: 'Error fetching items' })
  }
})

app.post("/api/items", async (req, res) => {
  try {
    const newItem = new ShoppingItem(req.body)
    await newItem.save()
    console.log('Created new item:', newItem) // Add logging
    res.json(newItem)
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({ error: 'Error creating item' })
  }
})

app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await ShoppingItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    console.log('Updated item:', updatedItem) // Add logging
    res.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ error: 'Error updating item' })
  }
})

app.delete("/api/items/:id", async (req, res) => {
  try {
    await ShoppingItem.findByIdAndDelete(req.params.id)
    console.log('Deleted item:', req.params.id) // Add logging
    res.json({ message: "Item deleted" })
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ error: 'Error deleting item' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})