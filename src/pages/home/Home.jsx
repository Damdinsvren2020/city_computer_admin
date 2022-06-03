import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import User from "../users/User";
import Dashboard from "../../components/dashboard/dashboard";
import { useState } from "react";

const Home = () => {
  const [whichComponent, setWhichComponent] = useState("");

  const RenderComponent = () => {
    switch (whichComponent) {
      case "Хэрэглэгч":
        return <User />;
      case "Dashboard":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="home">
      <div className="w-96 flex flex-col h-screen">
        <Sidebar
          whichComponent={whichComponent}
          setWhichComponent={setWhichComponent}
        />
      </div>

      {RenderComponent()}
    </div>
  );
};

export default Home;
