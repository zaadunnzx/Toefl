import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      {currentView === 'landing' && (
        <LandingPage onEnterApp={() => setCurrentView('dashboard')} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard onBackToHome={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

export default App;
