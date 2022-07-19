import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import CouponTable from "../../components/tables/couponTables/coupon_table";

const Coupon = () => {
  return (
    <div className="flex ">
      <div className=" flex flex-col h-screen">
        <Sidebar />
      </div>
      <div className="w-full bg-white	">
        <Navbar />
        <CouponTable />
      </div>
    </div>
  );
};

export default Coupon;
