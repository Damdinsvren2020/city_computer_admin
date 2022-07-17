import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Category_Table from "../../components/tables/category_table/category_table";

const Category = () => {
  return (
    <div className="flex ">
      <div className=" flex flex-col h-screen">
        <Sidebar />
      </div>
      <div className="w-full bg-white	">
        <Navbar />
        <Category_Table />
      </div>
    </div>
  );
};

export default Category;
