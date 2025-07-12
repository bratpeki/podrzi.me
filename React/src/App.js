import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import CreateActionPage from './CreateActionPage';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage';
import ToSPage from './ToSPage';
import ProfilePage from './ProfilePage';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-4xl font-extrabold text-red-500">PNEIS</p>
        <p>
          EDITUJ <code>KURAC</code> PA SACUVAJ I PONOVO UCITAJ!
        </p>
        <Link
          to="/login"
          className="App-link"
        >
          ULOGUJ SE BRALEEEE
        </Link>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/createAction" element={<CreateActionPage/>}/>
        <Route path="/aboutUs" element={<AboutUsPage/>}/>
        <Route path="/contactUs" element={<ContactUsPage/>}/>
        <Route path="/toSPage" element={<ToSPage/>}/>
        <Route path="/profilePage" element={<ProfilePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
