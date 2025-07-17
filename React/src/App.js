import logo from "./logo.svg";
import "./App.css";
import { useNavigate } from 'react-router-dom';
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
import ViewDonationsPage from "./pages/ViewDonationsPage";
import ReviewPage from "./pages/ReviewPage";
import { AuthStateContext, useAuth } from "./components/UseAuthState";
import { useEffect } from "react";

function Home() {

  const navigate = useNavigate();

  useEffect(() => {

    navigate('/home');
    }, []);
  return (

    <div className="App">

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
            <Route path="/viewDonations/" element={<ViewDonationsPage />} />
            <Route path="/reviewPage/" element={<ReviewPage />} />
          </Routes>
        </Router>
      </AuthStateContext>
    </>
  );
}

export default App;
