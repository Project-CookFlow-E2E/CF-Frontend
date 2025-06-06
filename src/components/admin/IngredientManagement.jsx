// src/components/admin/IngredientManagement.jsx

import React, { useState } from 'react';

const IngredientManagement = () => {
  const [activeIngredientTab, setActiveIngredientTab] = useState('all'); // 'all' o 'pending'

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Ingredient Management</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Ingredient
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`${
              activeIngredientTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveIngredientTab("all")}
          >
            All ingredients (3)
          </button>
          <button
            className={`${
              activeIngredientTab === "pending"
                ? "border-yellow-500 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveIngredientTab("pending")}
          >
            2 ingredients pending approval (2)
          </button>
        </nav>
      </div>

      {activeIngredientTab === 'all' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">ID & Name</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Filas de ejemplo para 'All ingredients' */}
              <tr>
                <td className="py-2 px-4 border-b text-sm text-gray-700">1. Sugar</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">Baking</td>
                <td className="py-2 px-4 border-b text-sm">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Approved</span>
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  <button className="text-yellow-600 hover:text-yellow-900 mr-2">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
              {/* Más filas aquí */}
            </tbody>
          </table>
        </div>
      )}

      {activeIngredientTab === 'pending' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">ID & Name</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Submitted By</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Filas de ejemplo para 'Pending approval' */}
              <tr>
                <td className="py-2 px-4 border-b text-sm text-gray-700">1. Fresh Thyme</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">user@example.com</td>
                <td className="py-2 px-4 border-b text-sm">
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-2">Approve</button>
                  <button className="text-red-600 hover:text-red-900">Reject</button>
                </td>
              </tr>
              {/* Más filas aquí */}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Showing 1 to 3 of 3 results</span>
        <div>
          <button className="px-3 py-1 border rounded-md mr-1">Previous</button>
          <button className="px-3 py-1 border rounded-md">Next</button>
        </div>
      </div>
    </div>
  );
};

export default IngredientManagement;