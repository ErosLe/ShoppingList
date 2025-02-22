const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const { createServer } = require("@vercel/node")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch((error) => console.error('Error connecting to MongoDB:', error))

const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  amount: Number,
})

const ShoppingItem = mongoose.model("ShoppingItem", ShoppingItemSchema)

app.get("/api/items", async (req, res) => {
  try {
    const items = await ShoppingItem.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' })
  }
})

app.post("/api/items", async (req, res) => {
  try {
    const newItem = new ShoppingItem(req.body)
    await newItem.save()
    res.json(newItem)
  } catch (error) {
    res.status(500).json({ error: 'Error creating item' })
  }
})

app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await ShoppingItem.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedItem)
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' })
  }
})

app.delete("/api/items/:id", async (req, res) => {
  try {
    await ShoppingItem.findByIdAndDelete(req.params.id)
    res.json({ message: "Item deleted" })
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' })
  }
})

module.exports = createServer(app)
