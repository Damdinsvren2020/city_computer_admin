import React from "react";
import "./product.scss";
import Navbar from "../../components/navbar/Navbar";
import ProductTable from "../../components/tables/productdatatable/product_table";

const Product = () => {
  return (
    <div className="Product">
      <div className="ProductContainer">
        <Navbar />
        <ProductTable />
      </div>
    </div>
  );
};

export default Product;
