import * as React from "react";

import "./brand_table.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Input, Button, Card, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

import Paper from "@mui/material/Paper";

import axios from "axios";
import Swal from "sweetalert2";
import { CDNURL } from "../../../CDNURL";

const Datatable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editCategory, seteditCategory] = useState(false);
  const [editCategoryId, seteditCategoryId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [brand, setBrand] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    axios
      .get("/brand")
      .then((response) => {
        const data = response.data.data;
        console.log("dataaaaaa", response.data.data);
        setBrand(data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const Banner_Create = async (category_Create) => {
    try {
      const { data } = await axios.post("/brand", category_Create);
      if (data.Itemsuccess) {
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

  const editCategoryHandle = async (category) => {
    seteditCategoryId(category._id);
    console.log(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setVisible(true);
    seteditCategory(true);
  };

  const editCategoryApi = async (editCategoryForm) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post(
        `brand/${editCategoryId}`,
        editCategoryForm
      );
      if (data.success) {
        seteditCategoryId(false);
        seteditCategory(false);
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

  const deleteHandle = async (userId) => {
    try {
      const { data } = await axios.delete(`/brand/${userId}`);
      if (data.success) {
        setRefreshKey((old) => old + 1);
        new Swal({
          icon: "success",
          title: data.result,
        });
      }
      if (!data.success) {
        new Swal({
          icon: "error",
          title: data.result,
        });
      }
    } catch (error) {
      new Swal({
        icon: "error",
        title: "Брэнд устгахад алдаа гарлаа",
      });
    }
  };

  const props = {
    name: "image",
    action: CDNURL + "/api/banner",
    headers: {
      authorization: "Bearer " + localStorage.getItem("token"),
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
      }

      if (info.file.status === "done") {
        message.success(`${info.file.name} Таны зураг амжилттай орлоо`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} Алдаа гарлaаа.`);
      }
    },
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Нийт Брэнд
        <Button type="primary" onClick={showModal}>
          Нэмэх
        </Button>
      </div>
      <Card hoverable>
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
                        src={CDNURL + row.link}
                        alt=""
                        className="image"
                      />
                      {row.product}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={brand.length}
        rowsPerPage={rowsPerPage}
        page={page}
      />

      <Modal
        title={editCategory ? "Брэнд засах" : "Брэнд нэмэх"}
        width={380}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: true,
        }}
      >
        <Form
          form={form}
          initialValues={{
            name: "",
            description: "",
          }}
          encType="multipart/formdata"
          onFinish={editCategory ? editCategoryApi : Banner_Create}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          autoComplete="do-not-autofill"
        >
          <Form.Item
            label="Брэнд"
            name="name"
            rules={[
              {
                required: true,
                message: "Брэнд нэр оруулаагүй байна!",
              },
            ]}
          >
            <Input placeholder="Брэнд нэр ээ оруулна уу" autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Тайлбар"
            name="description"
            rules={[
              {
                required: true,
                message: "Тайлбар оруулаагүй байна!",
              },
            ]}
          >
            <Input placeholder="Брэнд тайлбар оруулна уу" autoComplete="off" />
          </Form.Item>
          <Form.Item label="Зураг оруулах">
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {editCategory ? (
              <Button block type="primary" htmlType="Үүсгэх">
                Edit
              </Button>
            ) : (
              <Button block type="primary" htmlType="Үүсгэх">
                Үүсгэх
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Datatable;
