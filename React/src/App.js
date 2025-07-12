import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import CreateActionPage from "./CreateActionPage";
import AboutUsPage from "./AboutUsPage";
import ContactUsPage from "./ContactUsPage";
import ToSPage from "./ToSPage";
import ProfilePage from "./ProfilePage";
import ActionViewPage from "./ActionViewPage";
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
        <h1
          style={{
            position: "fixed",
            padding: "8px",
            zIndex: 999,
            backgroundColor: "white",
          }}
        >
          Login state: {JSON.stringify(authState)}
        </h1>
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
            <Route path="/actionView" element={<ActionViewPage />} />
          </Routes>
        </Router>
      </AuthStateContext>
    </>
  );
}

export default App;
