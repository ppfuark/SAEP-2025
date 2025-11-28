// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Produtos from './components/Produtos';
import Estoque from './components/Estoque';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
  };

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {currentView === 'dashboard' && (
        <Dashboard onLogout={handleLogout} navigateTo={navigateTo} />
      )}
      {currentView === 'produtos' && (
        <Produtos navigateTo={navigateTo} />
      )}
      {currentView === 'estoque' && (
        <Estoque navigateTo={navigateTo} />
      )}
    </div>
  );
}

export default App;