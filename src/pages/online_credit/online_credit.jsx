import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Onlinecredit from "../../components/tables/online_credit/online_credit";
import { useNavigate } from "react-router-dom";

const Online_credit = () => {
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
              authorization: "Bearar" + user_token,
            },
          });
          if (data.success) {
            setUser(data.user);
            if (data.role === "user") {
              return history("/home");
            }
            if (data.role === "admin") {
              return history("/banner_images");
            }
          } else {
            history("/Login");
          }
        } catch (error) {
          console.log(error);
        }
      };
    }
  }, [history, refresh]);
  return (
    <div className="flex ">
      <div className=" flex flex-col h-screen">
        <Sidebar />
      </div>
      <div className="w-full bg-white	table">
        <Navbar />
        <Onlinecredit />
      </div>
    </div>
  );
};

export default Online_credit;
