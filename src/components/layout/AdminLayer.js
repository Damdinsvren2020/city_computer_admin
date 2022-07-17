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
  const [theme, setTheme] = useState("light");
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
      {/* <Sider
                trigger={<MenuOutlined className="trigger" />}
                width={220}
                theme={theme}
                collapsible
                collapsed={collapsed}
            >
                <div className="logo" style={{ textAlign: "center" }}>
                    <Link to="/admin">
                        <h3 style={{ padding: "20px 0 10px 0px" }}>
                            {collapsed ? "380" : "380 АДМИН"}
                        </h3>
                    </Link>
                </div>
                <Menu theme={theme} selectedKeys={active} mode="inline">
                    <Menu.ItemGroup key="g1" title="Захиалга">
                        <Menu.Item icon={<FiCreditCard />} key="orders">
                            <Link to="/admin">
                                <span> Захиалгууд</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item icon={<UserOutlined />} key="users">
                            <Link to="/admin/users">
                                <span> Хэрэглэгчид</span>
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g2" title="Каталог">
                        <Menu.Item icon={<BiBox />} key="product">
                            <Link to="/admin/product">
                                <span> Бараа бүтээгдэхүүн</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item icon={<RiFilter2Line />} key="category">
                            <Link to="/admin/category">
                                <span> Ангилал</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item icon={<RiBriefcase3Line />} key="brand">
                            <Link to="/admin/brand">
                                <span> Брэнд</span>
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g3" title="Вэбсайт">
                        <Menu.Item icon={<FiShare2 />} key="website">
                            <Link to="/admin">
                                <span> Нийтлэл</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item icon={<FiImage />} key="banner">
                            <Link to="/admin/banner">
                                <span>Баннер</span>
                            </Link>
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </Sider> */}
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
