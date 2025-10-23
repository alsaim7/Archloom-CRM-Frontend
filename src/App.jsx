import "./App.css";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Customers from "./pages/Customers";
import Filter from "./pages/Filter";
import UpdateCustomer from "./pages/UpdateCustomer";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appbar from "./components/Appbar";
import SessionTimeoutWatcher from "./components/utils/SessionTimeoutWatcher";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // ✅ add this

function App() {
  return (
    <Router>
      <SessionTimeoutWatcher />
      <Appbar />
      <ScrollToTop />    {/* ✅ add this here  */}
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/registration" element={<RequireAuth><Registration /></RequireAuth>} />
        <Route path="/customers" element={<RequireAuth><Customers /></RequireAuth>} />
        <Route path="/filter" element={<RequireAuth><Filter /></RequireAuth>} />
        <Route path="/updatecustomer" element={<RequireAuth><UpdateCustomer /></RequireAuth>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;