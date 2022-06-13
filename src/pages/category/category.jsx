import React from "react";
import "./category.scss";
import Navbar from "../../components/navbar/Navbar";
import Category_Table from "../../components/tables/category_table/category_table";

const Category = () => {
  return (
    <div className="Category">
      <div className="CategoryContainer">
        <Navbar />
        <Category_Table />
      </div>
    </div>
  );
};

export default Category;
