import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
// import Widget from "../../components/widget/Widget";
// import Featured from "../../components/featured/Featured";
// import Chart from "../../components/chart/Chart";
import User from "../users/User";
import Dashboard from "../../components/dashboard/dashboard";
import Category from "../category/category";
import Product from "../product/product";
import Banner from "../home_banner/Home_banner";
import Brand from "../brand/brand";
import Banner_images from "../banner_images/banner_images";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [whichComponent, setWhichComponent] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState([]);

  const history = useNavigate();

  const user_token = localStorage.getItem("token");
  useEffect(() => {
    if (user_token) {
      const authorize = async () => {
        try {
          const { data } = await axios.get("authorize", {
            headers: {
              authorization: "Bearer " + user_token,
            },
          });
          if (data.success) {
            setUser(data.user);
            if (data.role === "user") {
              return history("/home");
            }
            if (data.role === "admin") {
              return history("/home");
            }
          } else {
            history("/Login");
          }
        } catch (error) {
          console.log(error);
        }
      };
      authorize();
    } else {
      history("/Login");
    }
  }, [history, refresh]);

  const RenderComponent = () => {
    switch (whichComponent) {
      case "Хэрэглэгч":
        return <User />;
      case "Ангилал":
        return <Category />;
      case "Бүтээгдхүүн":
        return <Product />;
      case "Баннер":
        return <Banner />;
      case "Брэнд":
        return <Brand />;
      case "Баннер зурагнууд":
        return <Banner_images />;
      case "Dashboard":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-col h-screen">
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
