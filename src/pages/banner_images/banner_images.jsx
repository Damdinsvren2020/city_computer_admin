import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Banner_Images from "../../components/tables/banner_images/banner_images";

const Home_banner = () => {
  return (
    <div className="flex ">
      <div className=" flex flex-col h-screen">
        <Sidebar />
      </div>
      <div className="w-full bg-white	">
        <Navbar />
        <Banner_Images />
      </div>
    </div>
  );
};

export default Home_banner;
