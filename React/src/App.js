import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import CreateActionPage from "./Pages/CreateActionPage";
import AboutUsPage from "./Pages/AboutUsPage";
import ContactUsPage from "./Pages/ContactUsPage";
import ToSPage from "./Pages/ToSPage";
import ProfilePage from "./Pages/ProfilePage";
import ActionViewPage from "./Pages/ActionViewPage";
import EditProfilePage from "./Pages/EditProfilePage";
import EditActionPage from "./Pages/EditActionPage";
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
            <Route path="/aboutUs" element={<AboutUsPage />} />
            <Route path="/contactUs" element={<ContactUsPage />} />
            <Route path="/toSPage" element={<ToSPage />} />
            <Route path="/profilePage" element={<ProfilePage />} />
            <Route path="/actionView/:id" element={<ActionViewPage />} />
            <Route path="/editProfilePage/" element={<EditProfilePage />} />
            <Route path="/editAction/" element={<EditActionPage />} />
          </Routes>
        </Router>
      </AuthStateContext>
    </>
  );
}

export default App;
