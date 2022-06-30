import React from "react";
import "./brand.scss";
import Navbar from "../../components/navbar/Navbar";
import Brand_Table from "../../components/tables/brand_table/brand_table";

const Brand = () => {
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
