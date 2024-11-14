import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

/* components */
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Container from './components/layout/Container.jsx';
import Message from './components/layout/Message.jsx';

/* pages */
import Home from './components/pages/Home.jsx';
import Login from './components/pages/Auth/Login.jsx';
import Register from './components/pages/Auth/Register.jsx';
import Profile from './components/pages/User/Profile.jsx';

/* context */
import { UserProvider } from './context/UserContext.js';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile />}></Route>
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
