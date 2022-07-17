import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  RiBriefcase3Line,
  RiFilter2Line,
  RiImageFill,
  RiShoppingBagFill,
} from "react-icons/ri";

// import Imagesss from "./logo-1.png";

import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Layout className="Sidebar">
      <Sider width={220}>
        <div className="logo" style={{ textAlign: "center" }}>
          <Link to="/home">
            <h3 style={{ padding: "20px 0 10px 0px" }}>АДМИН</h3>
            {/* <img src={Imagesss} className="w-[200px] h-[150px]" /> */}
          </Link>
        </div>
        <Menu mode="inline">
          <Menu.ItemGroup key="g1" title="Каталог">
            <Menu.Item icon={<RiImageFill />} key="banner_images">
              <Link to="/banner_images">
                <span>Баннер</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiBriefcase3Line />} key="brand">
              <Link to="/brand">
                <span>Брэнд</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiFilter2Line />} key="category">
              <Link to="/category">
                <span>Ангилал</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<UserOutlined />} key="users">
              <Link to="/user">
                <span>Хэрэглэгч</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiShoppingBagFill />} key="product">
              <Link to="/product">
                <span>Бүтээгдхүүн</span>
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
