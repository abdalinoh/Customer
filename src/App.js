import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddCustomer from './components/AddCustomer';
import CustomerDetails from './components/CustomerDetails'; // Assurez-vous d'importer le composant
import CustomerList from './components/CustomerList'; // Assurez-vous d'importer le composant
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/add_customer" element={<AddCustomer />} />
          <Route path="/customer/details/:phone_number" element={<CustomerDetails />} />
          <Route path="/customer/list" element={<CustomerList />} />
          {/* Ajoutez d'autres routes si nécessaire */}
          <Route path="/" element={<AddCustomer />} /> {/* Redirection vers la page d'ajout de client */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;