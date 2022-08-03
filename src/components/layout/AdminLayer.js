import React, { useEffect, useState } from "react";
import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";
import {
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { BiBox } from "react-icons/bi";
import { RiBriefcase3Line, RiFilter2Line } from "react-icons/ri";
import { FiCreditCard, FiImage, FiShare2 } from "react-icons/fi";
import { Layout, Menu, Row, Dropdown, Avatar } from "antd";
import { useSelector } from "react-redux";

const { Content, Sider, Header } = Layout;

const AdminLayer = ({ route: { routes }, location }) => {
  const [collapsed, setCollapsed] = useState(false);
  let active = (location.pathname?.split("/") || [])[2];
  useEffect(() => {
    if (!(user && user.role === "admin")) {
      window.location.assign("/404");
    }
  }, [user]);
  const navigate = useNavigate();

  const logOutUser = () => {
    navigate("/");
    localStorage.clear();
  };
  console.log(user);

  return (
    <Layout className="site-layout">
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
                  <Menu.Item>
                    <span>
                      <UserOutlined /> {`${user.last_name} ${user.first_name}`}
                    </span>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item>
                    <a onClick={logOutUser} style={{ fontSize: 14 }}>
                      <LogoutOutlined /> Гарах
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Avatar
                  size={"small"}
                  style={{ color: "#fff", backgroundColor: "#6A5495" }}
                >
                  {user?.first_name.toUpperCase().charAt(0)}
                </Avatar>
                <span style={{ marginLeft: "0.25rem" }}>
                  {user?.first_name}
                </span>
              </a>
            </Dropdown>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 24px",
            minHeight: "calc(100vh - 124px)",
            paddingTop: 0,
          }}
        >
          {renderRoutes(routes)}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayer;
