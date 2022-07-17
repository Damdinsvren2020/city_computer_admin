import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Layout, Menu, Row, Dropdown, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logOutUser = () => {
    navigate("/");
    localStorage.clear();
  };

  return (
    <Layout>
      <Header style={{ background: "#fff", height: 64, padding: "0 30px" }}>
        <Row
          align="middle"
          type="flex"
          justify="space-between"
          style={{ height: "100%", width: "98%" }}
        >
          <div>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <Dropdown
            style={{ marginRight: "2rem" }}
            overlay={
              <Menu style={{ minWidth: 120 }}>
                <Menu.Divider />
                <Menu.Item>
                  <a onClick={logOutUser} style={{ fontSize: 14 }}>
                    <LogoutOutlined /> Гарах
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link">
              <Avatar icon={<UserOutlined />}></Avatar>
              <span style={{ marginLeft: "0.25rem" }}></span>
            </a>
          </Dropdown>
        </Row>
      </Header>
    </Layout>
  );
};

export default Navbar;
