import { useEffect, useState } from "react";
import { Table, Dropdown, Button, Card, Modal } from "antd";
import moment from "moment";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const getBanner = async () => {
      const { data } = await axios.get("bannerimages");
      setBanner(data.result);
      console.log("test", data.result);
    };
    getBanner();
  }, [refreshKey]);

  const [orders, setOrders] = useState("");
  const [image2, setImage2] = useState(null);
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(false);
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
        setRefreshKey((old) => old + 1);
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
      newImage
        ? formdata.append("thumbnail", image[0])
        : formdata.append("thumbnailOld", image);
      newImage && formdata.append("newThumbnail", newImage);

      const { data } = await axios.put(
        "/bannerimages/" + bannerEditId,
        formdata
      );
      if (data.success) {
        setEditLoading(false);
        resetForm();
        setRefreshKey((old) => old + 1);
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

  const setEditModal = (banner) => {
    setCreateBannerModal(true);
    setBannerEdit(true);
    setName(banner.name);
    setOrders(banner.orders);
    setImage(banner.thumbnail);
    setBannerEditId(banner._id);
  };

  const resetForm = () => {
    setName("");
    setOrders("");
    setImage(null);
  };

  const setUpDelete = (banner) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${banner.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete("/bannerimages/" + banner._id);
        if (data.success) {
          setRefreshKey((old) => old + 1);
          setBannerEdit(false);
          resetForm();
          Swal.fire({
            icon: "success",
            title: "Устгагдлаа!",
          });
        } else {
          Swal.fire("Алдаа", "error");
        }
      }
    });
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
            <button
              className="text-yellow-500 text-xl mx-2"
              onClick={() => setEditModal(record)}
            >
              <EditOutlined />
            </button>
            <button
              className="text-red-500 text-xl mx-2"
              onClick={() => setUpDelete(record)}
            >
              <DeleteOutlined />
            </button>
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
        <button
          onClick={() => {
            setCreateBannerModal(true);
            setBannerEdit(false);
          }}
          className="border p-2 rounded-md flex justify-center items-center gap-2"
        >
          <PlusOutlined />  Баннер нэмэх
        </button>
      }
    >
      <Table size="small" columns={columns} dataSource={banner} />
      <Modal
        title={bannerEdit ? "Баннер засах" : "Баннер оруулах"}
        visible={createBannerModal}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setCreateBannerModal(false);
          resetForm();
        }}
        okText={bannerEdit ? "Засах" : "Илгээх"}
        onOk={bannerEdit ? () => editBanner() : () => registerBanner()}
      >
        <form>
          <div className="w-full h-96">
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
                    setNewImage(true);
                  } else {
                    setImage(null);
                    setNewImage(false);
                  }
                }}
                className="w-full p-2 border my-1"
                type="file"
                id="thumbnail"
                placeholder="Зурагнууд"
              />
              {newImage ? (
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
              ) : (
                <img
                  src={`${CDNURL}/${image}`}
                  alt="banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* {
              bannerEdit ?
                <Button onClick={() => editBanner()}>Засах</Button>
                :
                <Button onClick={() => registerBanner()}>Үүсгэх</Button>
            } */}
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default Banner_images;
