import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Initialize mongoose connection
let isConnected = false;
const connectDB = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      isConnected = true;
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
};

// Define the schema
const ShoppingItemSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  amount: Number,
});

// Get or create model
const ShoppingItem = mongoose.models.ShoppingItem || mongoose.model('ShoppingItem', ShoppingItemSchema);

// GET handler
export async function GET() {
  try {
    await connectDB();
    const items = await ShoppingItem.find();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const newItem = new ShoppingItem(data);
    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}