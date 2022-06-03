import React from "react";
import Navbar from "../../components/navbar/Navbar";
import "./dashboard.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";

const dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboardContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Test" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default dashboard;
