import React from "react";
import "./brand.scss";
import Navbar from "../../components/navbar/Navbar";
import Brand_Table from "../../components/tables/brand_table/brand_table";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Brand = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [token]);
  return (
    <div className="Brand">
      <div className="BrandContainer">
        <Navbar />
        <Brand_Table />
      </div>
    </div>
  );
};

export default Brand;
