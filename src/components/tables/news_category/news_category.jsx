import * as React from "react";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Input, Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@material-ui/core/TablePagination";

import axios from "axios";
import Swal from "sweetalert2";
import { CDNURL } from "../../../CDNURL";

const Datatable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newscategory, setNewsCategory] = useState([]);
  const [editCategory, setEditBrand] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [orders, setOrders] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, newscategory.length - page * rowsPerPage);

  useEffect(() => {
    axios
      .get("/news_category")
      .then((response) => {
        const data = response.data.data;
        setNewsCategory(data);

        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshKey]);

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const createNews_Category = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("orders", orders);
      formdata.append("thumbnail", image[0]);

      const { data } = await axios.post("/news_category", formdata);
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
        title: "Мэдээны ангилал үүсгэхэд алдаа гарлаа",
      });
    }
  };

  const setUpBrandEdit = async (newscategory) => {
    setEditCategoryId(newscategory._id);
    setName(newscategory.name);
    setDescription(newscategory.description);
    setOrders(newscategory.orders);
    setImage(newscategory.link);
    setLink(newscategory.link);
    setVisible(true);
    setEditBrand(true);
    setNewImage(false);
  };

  const editCategoryHandler = async () => {
    setConfirmLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("orders", orders);
      newImage
        ? formdata.append("thumbnail", image[0])
        : formdata.append("thumbnailOld", image);
      newImage && formdata.append("newThumbnail", newImage);
      console.log(editCategoryId);
      const { data } = await axios.put(
        `news_category/${editCategoryId}`,
        formdata
      );
      if (data.success) {
        setRefreshKey((old) => old + 1);
        setVisible(false);
        setConfirmLoading(false);
        form.resetFields();
        new Swal({
          icon: "success",
          title: "амжилттай засагдлаа",
        });
      }
      if (!data.success) {
        setConfirmLoading(false);
        new Swal({
          icon: "error",
        });
      }
    } catch (error) {
      setConfirmLoading(false);
      new Swal({
        icon: "error",
        title: "Мэдээны категори засахад алдаа гарлаа",
      });
    }
  };

  const deleteHandler = async (newscategory) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${newscategory.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(
          `/news_category/${newscategory._id}`
        );
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
          Мэдээны ангилал
        </Button>
      }
    >
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Ангилалын нэр</TableCell>
              <TableCell className="tableCell">Тайлбар</TableCell>
              <TableCell className="tableCell">Ангилалын Зураг</TableCell>
              <TableCell className="tableCell">Ангилалын дараалал</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newscategory.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="tableCell">
                  <h2>{row.name}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.description}</h2>
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
                  <h2>{row.orders}</h2>
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
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={newscategory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Modal
        title={editCategory ? "Ангилал засах" : "Мэдээны ангилал"}
        width={380}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={editCategory ? "Засах" : "Үүсгэх"}
        onOk={
          editCategory
            ? () => editCategoryHandler()
            : () => createNews_Category()
        }
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
        </div>
      </Modal>
    </Card>
  );
};

export default Datatable;
