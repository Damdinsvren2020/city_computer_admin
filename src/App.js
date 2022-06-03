import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import "./style/dark.scss";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { darkMode } = useContext(DarkModeContext);
  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [token]);
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <h1>CITY COMPUTER</h1>
    </div>
  );
}

export default App;
