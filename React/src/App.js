import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CreateActionPage from "./pages/CreateActionPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ToSPage from "./pages/ToSPage";
import ProfilePage from "./pages/ProfilePage";
import ActionViewPage from "./pages/ActionViewPage";
import EditProfilePage from "./pages/EditProfilePage";
import EditActionPage from "./pages/EditActionPage";
import { AuthStateContext, useAuth } from "./components/UseAuthState";
import { useEffect } from "react";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-4xl font-extrabold text-red-500">PNEIS</p>
        <p>
          EDITUJ <code>KURAC</code> PA SACUVAJ I PONOVO UCITAJ!
        </p>
        <Link to="/login" className="App-link">
          ULOGUJ SE BRALEEEE
        </Link>
      </header>
    </div>
  );
}

function App() {
  const { authState, authDispatch } = useAuth();

  return (
    <>
      <AuthStateContext value={{ authState, authDispatch }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/createAction" element={<CreateActionPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/tos" element={<ToSPage />} />
            <Route path="/profilePage" element={<ProfilePage />} />
            <Route path="/actionView/:id" element={<ActionViewPage />} />
            <Route path="/editProfilePage/" element={<EditProfilePage />} />
            <Route path="/editAction/:id" element={<EditActionPage />} />
          </Routes>
        </Router>
      </AuthStateContext>
    </>
  );
}

export default App;
