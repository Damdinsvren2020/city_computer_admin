import { useEffect, useState } from "react";
import {
  Table,
  Dropdown,
  Form,
  Button,
  Card,
  Modal,
  Input,
  InputNumber,
  Upload,
  Image,
  message,
} from "antd";
import moment from "moment";
import {
  LoadingOutlined,
  DownOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import MenuI from "./menu1/menu1";
import axios from "axios";
import Swal from "sweetalert2";

import { CDNURL } from "../../../CDNURL";
const url = "localhost:3001/api/bannerimages";
const Banner_images = () => {
  const [banner, setBanner] = useState([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editCategory, seteditCategory] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const getBanner = async () => {
      const { data } = await axios.get("bannerimages");
      setBanner(data.result);
    };
    getBanner();
  }, []);

  const showModal = () => {
    setVisible(true);
    seteditCategory(false);
    form.resetFields();
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  //create and save banner form

  const [name, setName] = useState("");
  const [orders, setOrders] = useState("");
  let files = [];
  const [image1, setImage1] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(url, { name: name, orders: orders });
      console.log("dadaaa", resp.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const columns = [
    {
      key: "num",
      title: "№",
      width: 60,
    },
    {
      key: "name",
      title: "Нэр",
      dataIndex: "name",
      render: (name) => <a>{name}</a>,
    },
    {
      key: "orders",
      title: "Дараалал",
      dataIndex: "orders",
      render: (orders) => <a>{orders}</a>,
    },
    {
      key: "created",
      title: "Огноо",
      width: 150,
      render: (text, record, idx) =>
        record.created ? moment(record.created).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Үйлдэл",
      key: "action",
      fixed: "right",
      render: (text, record) => {
        return (
          <>
            <Dropdown
              disabled={record.loading}
              trigger="click"
              overlay={MenuI(record)}
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                Үйлдэл
                {record.loading ? (
                  <LoadingOutlined spin={true} />
                ) : (
                  <DownOutlined />
                )}
              </a>
            </Dropdown>
          </>
        );
      },
      width: 90,
    },
  ];

  return (
    <Card
      title="Баннер"
      extra={
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          Баннер нэмэх
        </Button>
      }
    >
      <Table size="small" columns={columns} dataSource={banner} />
      <Modal
        title={editCategory ? "Ангилал засах" : "Баннер оруулах"}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: true,
        }}
      >
        {/* <input
          required
          value={bannerName}
          onChange={(e) => setBannerName(e.target.value)}
          type={"title"}
          className="w-full p-2 border my-1"
          placeholder="Баннер нэр"
        />
        <input
          required
          value={bannerOrders}
          onChange={(e) => setBannerOrders(e.target.value)}
          type={"number"}
          className="w-full p-2 border my-1"
          placeholder="Дараалал"
        />
        <input
          onChange={(e) => {
            setImage1(e.target.files);
            setImageNew1(true);
          }}
          type={"file"}
          className="w-full p-2 border my-1"
          placeholder="Зураг"
        />
        <Button type="primary" onClick={registerBanner}>
          Баннер нэмэх
        </Button> */}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type={"text"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border my-1"
              placeholder="Нэр"
            />
            <input
              type={"number"}
              value={orders}
              onChange={(e) => setOrders(e.target.value)}
              className="w-full p-2 border my-1"
              placeholder="Дараалал"
            />
            <Button onClick={handleSubmit}>Үүсгэх</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default Banner_images;
