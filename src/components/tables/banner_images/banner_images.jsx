import { useEffect, useState } from "react";
import { Table, Dropdown, Button, Card, Modal } from "antd";
import moment from "moment";
import { LoadingOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import MenuI from "./menu1/menu1";
import axios from "axios";
import Swal from "sweetalert2";

import { CDNURL } from "../../../CDNURL";
const Banner_images = () => {
  const [banner, setBanner] = useState([]);
  const [createBannerModal, setCreateBannerModal] = useState(false);

  const [editCategory, seteditCategory] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [bannerEditId, setBannerEditId] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [bannerEdit, setBannerEdit] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    const getBanner = async () => {
      const { data } = await axios.get("bannerimages");
      setBanner(data.result);
    };
    getBanner();
  }, []);

  const [orders, setOrders] = useState("");
  const [image2, setImage2] = useState(null);
  const [image, setImage] = useState(null);
  const [imageNew1, setImageNew1] = useState(false);

  const registerBanner = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      formdata.append("orders", orders);
      formdata.append("thumbnail", image[0]);
      const { data } = await axios.post("/bannerimages", formdata);
      if (data.success) {
        resetForm();
        setCreateBannerModal(false);
        Swal.fire({
          icon: "success",
          title: "Added",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
      });
    }
  };

  const editBanner = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      formdata.append("orders", orders);

      formdata.append("thumbnail", image2[0]);

      imageNew1
        ? formdata.append("avatar", image2[0])
        : formdata.append("avatarOld", image2);
      imageNew1 && formdata.append("newAvatar", imageNew1);

      const { data } = await axios.post(
        "/bannerimages/" + bannerEditId,
        formdata
      );
      if (data.success) {
        setEditLoading(false);
        resetForm();
        setCreateBannerModal(false);
        Swal.fire({
          icon: "success",
          title: "Засагдлаа",
        });
      }
    } catch (error) {
      setEditLoading(false);
      Swal.fire({
        icon: "error",
        title: "Алдаа гарлаа",
        text: error.message,
      });
    }
  };

  const resetForm = () => {
    setBanner([]);
    setName("");
    setOrders("");
    setImage(null);
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
      render: (Name) => <a>{Name}</a>,
    },
    {
      key: "orders",
      title: "Дараалал",
      dataIndex: "orders",
      render: (orders) => <a>{orders}</a>,
    },
    {
      key: "thumbnail",
      title: "zurag",
      dataIndex: "thumbnail",
      render: (thumbnail) => (
        <img
          src={`${CDNURL}/${thumbnail}`}
          className="w-24 h-24 object-contain"
        />
      ),
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
      style={{ marginLeft: "20px" }}
      extra={
        <Button
          onClick={() => setCreateBannerModal(true)}
          icon={<PlusOutlined />}
        >
          Баннер нэмэх
        </Button>
      }
    >
      <Table size="small" columns={columns} dataSource={banner} />
      <Modal
        title={editCategory ? "Ангилал засах" : "Баннер оруулах"}
        visible={createBannerModal}
        confirmLoading={confirmLoading}
        onCancel={() => setCreateBannerModal(false)}
        okText={bannerEdit ? "Засах" : "Илгээх"}
        onOk={bannerEdit ? () => editBanner() : () => registerBanner()}
        okButtonProps={{
          disabled: true,
        }}
      >
        <form>
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
            <div className="w-full flex flex-wrap gap-2 mt-4 w-48 h-48">
              <input
                onChange={(e) => {
                  if (e.target?.files) {
                    setImage(e.target.files);
                  } else {
                    setImage(null);
                  }
                }}
                className="w-full p-2 border my-1"
                type="file"
                id="thumbnail"
                placeholder="Зурагнууд"
              />
              <img
                src={
                  image
                    ? image
                      ? URL.createObjectURL(image[0] && image[0])
                      : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                    : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.jpg"
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <Button onClick={() => registerBanner()}>Үүсгэх</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default Banner_images;
