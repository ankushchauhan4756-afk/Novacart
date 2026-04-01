import React from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'

const mockProducts = [
  { id: 1, name: 'Wireless Headphones', price: 4999, stock: 45, category: 'Tech' },
  { id: 2, name: 'Cotton T-Shirt', price: 599, stock: 120, category: 'Clothes' },
  { id: 3, name: 'Designer Sunglasses', price: 2999, stock: 30, category: 'Fashion' },
]

export default function AdminProducts() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Product Name</th>
                <th className="px-6 py-4 text-left font-bold">Price</th>
                <th className="px-6 py-4 text-left font-bold">Stock</th>
                <th className="px-6 py-4 text-left font-bold">Category</th>
                <th className="px-6 py-4 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-semibold">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 20
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded transition">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
