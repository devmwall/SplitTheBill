import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RenderReceipt from './pages/RenderReceipt';
import Main from './pages/Main';

function App() {

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<Main />}
          />
          <Route path="/receipt/:id" element={<RenderReceipt />} />
        </Routes>
      </div>
    </Router>
  ); 
}

export default App;
