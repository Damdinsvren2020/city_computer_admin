import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  RiBriefcase3Line,
  RiFilter2Line,
  RiImageFill,
  RiShoppingBagFill,
  RiCoupon3Fill,
  RiFilePaper2Line,
  RiNewspaperFill,
  RiExchangeDollarFill,
} from "react-icons/ri";

// import Imagesss from "./logo-1.png";

import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Layout className="Sidebar">
      <Sider width={220}>
        <div className="logo" style={{ textAlign: "center" }}>
          <Link to="/admin/home">
            <h3 style={{ padding: "20px 0 10px 0px" }}>АДМИН</h3>
            {/* <img src={Imagesss} className="w-[200px] h-[150px]" /> */}
          </Link>
        </div>
        <Menu mode="inline">
          <Menu.ItemGroup key="g1" title="Каталог">
            <Menu.Item icon={<RiImageFill />} key="/admin/banner_images">
              <Link to="/admin/banner_images">
                <span>Баннер</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiBriefcase3Line />} key="/admin/brand">
              <Link to="/admin/brand">
                <span>Брэнд</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiFilter2Line />} key="/admin/bigcategory">
              <Link to="/admin/bigcategory">
                <span>Ангилал ангилах</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiFilter2Line />} key="/admin/category">
              <Link to="/admin/category">
                <span>Ангилал</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<UserOutlined />} key="/admin/users">
              <Link to="/admin/user">
                <span>Хэрэглэгч</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiShoppingBagFill />} key="/admin/product">
              <Link to="/admin/product">
                <span>Бүтээгдхүүн</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiCoupon3Fill />} key="/admin/coupon">
              <Link to="/admin/coupon">
                <span>Купон</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiFilePaper2Line />} key="/admin/order">
              <Link to="/admin/order">
                <span>Захиалга</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiFilePaper2Line />} key="/admin/invoice">
              <Link to="/admin/invoice">
                <span>Нэхэмжлэл</span>
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup key="g1" title="Мэдээ">
            <Menu.Item icon={<RiNewspaperFill />} key="/admin/news_category">
              <Link to="/admin/news_category">
                <span>Ангилал</span>
              </Link>
            </Menu.Item>
            <Menu.Item icon={<RiNewspaperFill />} key="/admin/news">
              <Link to="/admin/news">
                <span>Мэдээ</span>
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
          {/* <Menu.ItemGroup key="g1" title="Онлайн лизинг">
            <Menu.Item icon={<RiExchangeDollarFill />} key="/admin/online_credit">
              <Link to="/admin/online_credit">
                <span>Онлайн лизинг</span>
              </Link>
            </Menu.Item>
          </Menu.ItemGroup> */}
        </Menu>
      </Sider>
    </Layout>
  );
};

export default Sidebar;
