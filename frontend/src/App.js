import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

/* components */
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Container from './components/layouts/Container';

/* pages */
import Home from './components/pages/Home.jsx';
import Login from './components/pages/Auth/Login.jsx';
import Register from './components/pages/Auth/Register.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
