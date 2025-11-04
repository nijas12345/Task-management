import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminDashBoard from "./pages/AdminHome";
import UserDashBoard from "./pages/UserHome";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

  <Route
    path="/signup"
    element={
      <PublicRoute>
        <Signup />
      </PublicRoute>
    }
  />
        <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashBoard />
              </ProtectedRoute>
            }
          />
      </Routes>
      <ToastContainer
      />
    </Router>
  );
}

export default App;
