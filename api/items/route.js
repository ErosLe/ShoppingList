import mongoose from "mongoose"
import { NextResponse } from "next/server"

// Initialize mongoose connection
let isConnected = false
const connectDB = async () => {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    console.log("MongoDB connected")
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}

// Define the schema
const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  amount: Number,
})

// Get or create model
const ShoppingItem = mongoose.models.ShoppingItem || mongoose.model("ShoppingItem", ShoppingItemSchema)

export async function GET() {
  try {
    await connectDB()
    const items = await ShoppingItem.find()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()
    const newItem = new ShoppingItem(data)
    await newItem.save()
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

