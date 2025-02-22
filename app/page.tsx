"use client"

import { useState, useEffect } from "react"
import { Plus, X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

interface ShoppingItem {
  _id: string
  name: string
  checked: boolean
  amount: number | null
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-vercel-app.vercel.app/api"

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [newItem, setNewItem] = useState("")
  const [totalSum, setTotalSum] = useState(0)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    calculateTotalSum()
  }, [items])

  const fetchItems = async () => {
    console.log("Fetching items from:", `${API_URL}/items`)
    try {
      const response = await fetch(`${API_URL}/items`)
      const data = await response.json()
      console.log("Fetched items:", data)
      setItems(data)
    } catch (error) {
      console.error("Error fetching items:", error)
    }
  }

  const addItem = async () => {
    if (newItem.trim() !== "") {
      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newItem.trim(), checked: false, amount: null }),
      })
      const data = await response.json()
      setItems([...items, data])
      setNewItem("")
    }
  }

  const removeItem = async (id: string) => {
    await fetch(`${API_URL}/items/${id}`, { method: "DELETE" })
    setItems(items.filter((item) => item._id !== id))
  }

  const toggleItem = async (id: string) => {
    const item = items.find((item) => item._id === id)
    if (item) {
      const updatedItem = { ...item, checked: !item.checked }
      if (updatedItem.checked && updatedItem.amount === null) {
        const amount = prompt(`Enter amount spent on ${item.name}:`)
        updatedItem.amount = amount ? Number.parseFloat(amount) : null
      }
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })
      const data = await response.json()
      setItems(items.map((item) => (item._id === id ? data : item)))
    }
  }

  const editAmount = async (id: string) => {
    const item = items.find((item) => item._id === id)
    if (item) {
      const newAmount = prompt(`Enter new amount for ${item.name}:`, item.amount?.toString() || "")
      if (newAmount !== null) {
        const updatedItem = { ...item, amount: Number.parseFloat(newAmount) || null }
        const response = await fetch(`${API_URL}/items/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedItem),
        })
        const data = await response.json()
        setItems(items.map((item) => (item._id === id ? data : item)))
      }
    }
  }

  const calculateTotalSum = () => {
    const sum = items.reduce((acc, item) => acc + (item.amount || 0), 0)
    setTotalSum(sum)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-8 relative">
      <div className="fixed top-4 left-4 z-10">
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-primary dark:bg-[#ebb800] w-[3rem] h-[1.5rem]"
        />
      </div>
      <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow z-10">
        <span className="font-bold dark:text-[#ebb800]">Total: ${totalSum.toFixed(2)}</span>
      </div>
      <Card className="max-w-md mx-auto dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center dark:text-[#ebb800]">Shopping List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Add new item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              className="dark:bg-gray-700 dark:text-[#ebb800]"
            />
            <Button onClick={addItem} className="dark:bg-[#ebb800] dark:text-black">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded shadow"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleItem(item._id)}
                    className="border-primary dark:border-[#ebb800] dark:data-[state=checked]:bg-[#ebb800] dark:data-[state=checked]:text-black"
                  />
                  <span className={`${item.checked ? "line-through" : ""} dark:text-[#ebb800]`}>{item.name}</span>
                  {item.amount !== null && <span className="ml-2 dark:text-[#ebb800]">${item.amount.toFixed(2)}</span>}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editAmount(item._id)}
                    className="dark:border-[#ebb800] dark:text-[#ebb800]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item._id)}
                    className="dark:text-[#ebb800]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

