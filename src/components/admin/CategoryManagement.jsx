// src/components/admin/CategoryManagement.jsx

import React from 'react';

const CategoryManagement = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Category
        </button>
      </div>
      {/* Aquí irá la tabla de gestión de categorías */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">ID & Name</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Description</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Filas de ejemplo */}
            <tr>
              <td className="py-2 px-4 border-b text-sm text-gray-700">1. Lunch</td>
              <td className="py-2 px-4 border-b text-sm text-gray-700">Daily meals that are quick and satisfying</td>
              <td className="py-2 px-4 border-b text-sm">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
              </td>
              <td className="py-2 px-4 border-b text-sm">
                <button className="text-yellow-600 hover:text-yellow-900 mr-2">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            {/* Repite para más filas */}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>Showing 1 to 7 of 7 results</span>
        <div>
          <button className="px-3 py-1 border rounded-md mr-1">Previous</button>
          <button className="px-3 py-1 border rounded-md">Next</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;