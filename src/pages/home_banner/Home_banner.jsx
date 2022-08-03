import React from "react";
import "./home_banner.scss";
import Navbar from "../../components/navbar/Navbar";
import Banner_Table from "../../components/tables/banner_table/banner_table";

const Home_banner = () => {
  return (
    <div className="Banner">
      <div className="BannerContainer table">
        <Navbar />
        <Banner_Table />
      </div>
    </div>
  );
};

export default Home_banner;
