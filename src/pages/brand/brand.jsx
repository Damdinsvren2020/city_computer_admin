import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Brand_Table from "../../components/tables/brand_table/brand_table";

const Brand = () => {
  return (
    <div className="flex ">
      <div className=" flex flex-col h-screen">
        <Sidebar />
      </div>
      <div className="w-full bg-white	">
        <Navbar />
        <Brand_Table />
      </div>
    </div>
  );
};

export default Brand;
