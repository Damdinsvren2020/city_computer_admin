import * as React from "react";

import "./category_table.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Input, Button, Card, message, Upload } from "antd";
import { UploadOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
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
  const [angilal, setAngilal] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dropDownAngilal, setDropDownAngilal] = useState(false)
  const [matchingIndex, setMatchingIndex] = useState("")


  useEffect(() => {
    axios
      .get("/angilal")
      .then((response) => {
        const data = response.data.data;
        setAngilal(data);
        setFilteredCategory(data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshKey]);

  const showModal = () => {
    setVisible(true);
    seteditCategory(false);
    form.resetFields();
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const Categorycreate = async (category_Create) => {
    try {
      const { data } = await axios.post("/angilal/image", category_Create);
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
        `angilal/${editCategoryId}`,
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
        title: "Ангилалийн мэдээлэл засахад алдаа гарлаа",
      });
    }
  };

  const deleteHandle = async (userId) => {
    try {
      const { data } = await axios.delete(`/angilal/${userId}`);
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
        title: "Ангилал устгахад алдаа гарлаа",
      });
    }
  };

  const props = {
    name: "image",
    action: "http://localhost:3001/api/banner",
    headers: {
      authorization: "Bearer " + localStorage.getItem("token"),
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }

      if (info.file.status === "done") {
        message.success(`${info.file.name} Таны зураг амжилттай орлоо`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} Алдаа гарлaаа.`);
      }
    },
  };

  const [subAngilalName, setSubAngilalName] = useState("")
  const [subAngilalDesc, setSubAngilalDesc] = useState("")
  const [FilteredCategory, setFilteredCategory] = useState([])

  const createSubAngilal = async (id) => {
    try {
      if (subAngilalName.trim() === "" || subAngilalDesc.trim() === "") {
        return Swal.fire({
          icon: "warning",
          title: "Бүх хэсгийг бөглөнө үү"
        })
      }
      let formdata = new FormData()
      formdata.append("category", id)
      formdata.append("name", subAngilalName)
      formdata.append("content", subAngilalDesc)
      formdata.append("angilal", id)
      const { data } = await axios.post("/subangilal", formdata)
      if (data.success) {
        setRefreshKey((old) => old + 1);
        setSubAngilalName("")
        setSubAngilalDesc("")
        Swal.fire({
          icon: "success",
          title: "Нэмэгдсэн "
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const searchingCategory = (prop) => {
    if (angilal) {
      const SearchAngilal = angilal.filter((el) => {
        if (prop === '') {
          return el;
        }
        else {
          return el.name.toLowerCase().includes(prop)
        }
      })
      return setFilteredCategory(SearchAngilal)
    }
  }



  return (
    <div className="datatable">
      <div className="datatableTitle">
        Нийт Ангилал
        <Button type="primary" onClick={showModal}>
          Нэмэх
        </Button>
      </div>
      <Card hoverable>
        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="tableCell">Ангилал нэр</TableCell>
                <TableCell className="tableCell">Зураг</TableCell>
                <TableCell className="tableCell">Үйлдэл</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {angilal.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="tableCell">
                    <h2>{row.name}</h2>
                  </TableCell>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
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
        key={"_id"}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={angilal.length}
        rowsPerPage={rowsPerPage}
        page={page}
      />

      <Modal
        title={editCategory ? "Ангилал засах" : "Ангилал нэмэх"}
        width={1000}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: true,
        }}
      >
        <div className="w-full flex ">
          <div className="w-3/6 flex justify-center items-center">
            <Form
              form={form}
              initialValues={{
                name: "",
                description: "",
              }}
              encType="multipart/formdata"
              onFinish={editCategory ? editCategoryApi : Categorycreate}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              autoComplete="do-not-autofill"
            >
              <Form.Item
                label="Ангилал"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Ангилалын нэр оруулаагүй байна!",
                  },
                ]}
              >
                <Input
                  placeholder="Ангилалын нэр ээ оруулна уу"
                  autoComplete="off"
                />
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
                <Input
                  placeholder="Ангилалын тайлбар оруулна уу"
                  autoComplete="off"
                />
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
          </div>
          <div className="w-3/6">
            <input autoCapitalize="none" onChange={(e) => searchingCategory(e.target.value)} type={"search"} className="w-full p-2 border rounded-sm" placeholder="Ангилал хайх" />
            <div className="w-full h-[700px] overflow-auto">
              {
                FilteredCategory.map((item, index) => (
                  <div key={index} className="w-full border p-2 my-2 mx-auto">
                    <button onClick={() => {
                      setDropDownAngilal(true)
                      setMatchingIndex(index)
                    }} className="w-full flex flex-row gap-2 items-center">
                      <h1 className="text-black text-lg"><PlusOutlined /></h1>
                      <h1 className="text-black text-lg">{item.name}</h1>
                    </button>
                    {
                      matchingIndex === index && dropDownAngilal &&
                      <div className="w-full h-96 overflow-auto">
                        <div className="w-full flex flex-col gap-1">
                          <div className="w-full flex flex-col gap-2">
                            <input value={subAngilalName} onChange={(e) => setSubAngilalName(e.target.value)} className="w-full border p-2" placeholder="Дэд ангилал нэр" />
                            <input value={subAngilalDesc} onChange={(e) => setSubAngilalDesc(e.target.value)} className="w-full border p-2" placeholder="Дэд ангилал тайлбар" />
                            <button onClick={() => createSubAngilal(item._id)} className="w-full bg-[#1990ff] p-2 text-white text-xl flex justify-center items-center"> <PlusOutlined /></button>
                          </div>
                          <div className="w-full ">
                            {
                              item?.SubAngilal?.map((item, index) => (
                                <div className="w-full p-2 hover:bg-gray-200">
                                  <h1>{item.name}</h1>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Datatable;
