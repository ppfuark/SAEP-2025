// src/components/Dashboard.js
import React from 'react';

function Dashboard({ onLogout, navigateTo }) {
  const username = localStorage.getItem('username');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Sistema SAEP</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {username}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card Produtos */}
            <div 
              onClick={() => navigateTo('produtos')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform hover:scale-105 transition duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <span className="text-white text-2xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Produtos</h3>
                    <p className="text-sm text-gray-500">Gerenciar cadastro de produtos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Estoque */}
            <div 
              onClick={() => navigateTo('estoque')}
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform hover:scale-105 transition duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Estoque</h3>
                    <p className="text-sm text-gray-500">Controle de entrada e saída</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Relatórios */}
            <div className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform hover:scale-105 transition duration-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Relatórios</h3>
                    <p className="text-sm text-gray-500">Relatórios de movimentação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;