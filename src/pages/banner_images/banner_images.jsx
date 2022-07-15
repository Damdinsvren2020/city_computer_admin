import React from "react";
import "./banner_images.scss";
import Navbar from "../../components/navbar/Navbar";
import Banner_Images from "../../components/tables/banner_images/banner_images";

const Home_banner = () => {
  return (
    <div className="Banner">
      <div className="BannerContainer">
        <Navbar />
        <Banner_Images />
      </div>
    </div>
  );
};

export default Home_banner;
