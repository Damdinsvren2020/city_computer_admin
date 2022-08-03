import * as React from "react";

import "./brand_table.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Input, Button, Card, message, Upload, Dropdown } from "antd";
import moment from "moment";
import {
  UploadOutlined,
  LoadingOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuI from "./menu1/menu1";
import Paper from "@mui/material/Paper";
import { Pagination } from "@mui/material/Pagination/Pagination";

import axios from "axios";
import Swal from "sweetalert2";
import { CDNURL } from "../../../CDNURL";

const Datatable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [brand, setBrand] = useState([]);
  const [editBrand, setEditBrand] = useState(false);
  const [editBrandId, setEditBrandId] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dataPage, setDataPage] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowPerPage] = useState(5);

  useEffect(() => {
    axios
      .get("/brand")
      .then((response) => {
        const data = response.data.data;
        setBrand(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshKey]);

  useEffect(() => {
    setPage(0);
  }, [dataPage]);

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const createBrand = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("thumbnail", image[0]);
      const { data } = await axios.post("/brand/image", formdata);
      if (data.success) {
        setVisible(false);
        setConfirmLoading(false);
        setRefreshKey((old) => old + 1);
        new Swal({
          icon: "success",
          title: data.result,
        });
      }
      if (!data.success) {
        setConfirmLoading(false);
        new Swal({
          icon: "error",
          title: data.result,
        });
      }
    } catch (error) {
      setConfirmLoading(false);
      console.log(error);
      new Swal({
        icon: "error",
        title: "Категори үүсгэхэд алдаа гарлаа",
      });
    }
  };

  const setUpBrandEdit = async (brand) => {
    setEditBrandId(brand._id);
    setName(brand.name);
    setDescription(brand.description);
    setImage(brand.link);
    setVisible(true);
    setEditBrand(true);
    setNewImage(false);
  };

  const editBrandHandler = async () => {
    setConfirmLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      newImage
        ? formdata.append("thumbnail", image[0])
        : formdata.append("thumbnailOld", image);
      newImage && formdata.append("newThumbnail", newImage);
      const { data } = await axios.put(`brand/${editBrandId}`, formdata);
      if (data.success) {
        setRefreshKey((old) => old + 1);
        setVisible(false);
        setConfirmLoading(false);
        form.resetFields();
        new Swal({
          icon: "success",
          name: data.result,
          description: data.result,
        });
      }
      if (!data.success) {
        setConfirmLoading(false);
        new Swal({
          icon: "error",
          title: data.result,
        });
      }
    } catch (error) {
      setConfirmLoading(false);
      console.log(error);
      new Swal({
        icon: "error",
        title: "Брэндийн мэдээлэл засахад алдаа гарлаа",
      });
    }
  };

  const deleteHandler = async (brand) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${brand.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`/brand/${brand._id}`);
        if (data.success) {
          setRefreshKey((old) => old + 1);
          resetform();
          setEditBrand(false);
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

  const resetform = () => {
    setName("");
    setDescription("");
    setImage(null);
  };

  const onDataPageChange = (event, page) => setDataPage(page - 1);
  const handleChangePage = (event, page) => setPage(newpage);
  const handleChangeRowsPerPage = (event, newPage) => setPage(newpage);

  return (
    <Card
      style={{ marginLeft: "20px" }}
      extra={
        <Button
          onClick={() => {
            showModal(true);
            setEditBrand(false);
            resetform();
          }}
          icon={<PlusOutlined />}
        >
          Баннер нэмэх
        </Button>
      }
    >
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Брэнд нэр</TableCell>
              <TableCell className="tableCell">Зураг</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brand.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="tableCell">
                  <h2>{row.name}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    <img
                      src={`${CDNURL}/${row.link}`}
                      alt=""
                      className="image w-48 h-48 object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    <button
                      onClick={() => setUpBrandEdit(row)}
                      className="text-yellow-500 text-xl mx-2"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => deleteHandler(row)}
                      className="text-red-500 text-xl mx-2"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        title={editBrand ? "Брэнд засах" : "Брэнд нэмэх"}
        width={380}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={editBrand ? "Засах" : "Үүсгэх"}
        onOk={editBrand ? () => editBrandHandler() : () => createBrand()}
      >
        <div className="w-full h-96">
          <input
            type={"text"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Нэр"
          />
          <input
            type={"text"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Тайлбар"
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
        </div>
      </Modal>
    </Card>
  );
};

export default Datatable;
