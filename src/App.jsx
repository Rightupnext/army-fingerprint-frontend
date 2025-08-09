import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddUserForm from './componenets/AddUserForm';
import Home from './componenets/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-user" element={<AddUserForm />} />
      </Routes>
    </Router>
  );
}

export default App;
