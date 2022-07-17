import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ProductTable from "../../components/tables/productdatatable/product_table";

const Product = () => {
  return (
    <div className="flex ">
      <div className=" flex flex-col h-screen">
        <Sidebar />
      </div>
      <div className="w-full bg-white	">
        <Navbar />
        <ProductTable />
      </div>
    </div>
  );
};

export default Product;
