import React from "react";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import { Menu, Popconfirm } from "antd";

const MenuI = (record) => {
  return (
    <Menu>
      <Menu.Item key="1" icon={<EditFilled />}>
        Засах
      </Menu.Item>
      <Menu.Divider />
      {record.status === "active" ? (
        <Popconfirm
          title={`Та итгэлтэй байна уу ?`}
          okText="Тийм"
          placement="left"
          cancelText="Болих"
        >
          <Menu.Item key="4" icon={<DeleteFilled style={{ color: "red" }} />}>
            Устгах
          </Menu.Item>
        </Popconfirm>
      ) : null}
    </Menu>
  );
};
export default MenuI;
