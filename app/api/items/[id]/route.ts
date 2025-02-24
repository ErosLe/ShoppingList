import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Initialize mongoose connection
let isConnected = false;
const connectDB = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      isConnected = true;
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

// PUT handler
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();
    const updatedItem = await ShoppingItem.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await ShoppingItem.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Item deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}