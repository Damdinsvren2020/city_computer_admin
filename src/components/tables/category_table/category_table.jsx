import * as React from "react";

import "./category_table.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Swal from "sweetalert2";
import { CDNURL } from "../../../CDNURL";

const Datatable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editCategory, seteditCategory] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [angilal, setAngilal] = useState([]);
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(false);

  const [dropDownAngilal, setDropDownAngilal] = useState(false);
  const [matchingIndex, setMatchingIndex] = useState("");
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
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
    rowsPerPage - Math.min(rowsPerPage, angilal.length - page * rowsPerPage);
  useEffect(() => {
    axios
      .get("/angilal")
      .then((response) => {
        const data = response.data.data;
        setAngilal(data);
        setFilteredCategory(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshKey]);

  const showModal = () => {
    setVisible(true);
    seteditCategory(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  const setUpEditCategory = (category) => {
    seteditCategory(true);
    setVisible(true);
    setEditCategoryId(category._id);
    setName(category.name);
    setDescription(category.description);
    setImage(category.link);
  };

  const Categorycreate = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", Name);
      formdata.append("description", Description);
      formdata.append("avatar", image[0]);
      const { data } = await axios.post("/angilal/image", formdata);
      if (data.success) {
        setVisible(false);
        setConfirmLoading(false);
        setRefreshKey((old) => old + 1);
        resetCategory();
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

  const CategoryEdit = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", Name);
      formdata.append("description", Description);
      newImage
        ? formdata.append("avatar", image[0])
        : formdata.append("avatarOld", image);
      newImage && formdata.append("newAvatar", newImage);
      const { data } = await axios.put("/angilal/" + editCategoryId, formdata);
      if (data.success) {
        resetCategory();
        seteditCategory(false);
        setVisible(false);
        setRefreshKey((old) => old + 1);
        new Swal({
          icon: "success",
        });
      }
    } catch (error) {
      new Swal({
        icon: "error",
      });
    }
  };

  const categoryDelete = async (category) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${category.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete("/angilal/" + category._id);
        if (data.success) {
          setRefreshKey((old) => old + 1);
          Swal.fire({
            icon: "success",
            title: "Устгагдлаа!",
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: data.result,
            text: data.description,
          });
        }
      }
    });
  };

  const resetCategory = () => {
    setName("");
    setDescription("");
    setImage(null);
  };

  const [subAngilalName, setSubAngilalName] = useState("");
  const [subAngilalDesc, setSubAngilalDesc] = useState("");
  const [FilteredCategory, setFilteredCategory] = useState([]);
  const [editSubAngilal, setEditSubAngilal] = useState(false);
  const [editSubAngilalId, setEditSubAngilalId] = useState("");

  const createSubAngilal = async (id) => {
    try {
      if (subAngilalName.trim() === "" || subAngilalDesc.trim() === "") {
        return Swal.fire({
          icon: "warning",
          title: "Бүх хэсгийг бөглөнө үү",
        });
      }
      let formdata = new FormData();
      formdata.append("category", id);
      formdata.append("name", subAngilalName);
      formdata.append("content", subAngilalDesc);
      formdata.append("angilal", id);
      const { data } = await axios.post("/subangilal", formdata);
      if (data.success) {
        setRefreshKey((old) => old + 1);
        setSubAngilalName("");
        setSubAngilalDesc("");
        Swal.fire({
          icon: "success",
          title: "Нэмэгдсэн ",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchingCategory = (prop) => {
    if (angilal) {
      const SearchAngilal = angilal.filter((el) => {
        if (prop === "") {
          return el;
        } else {
          return el.name.toLowerCase().includes(prop);
        }
      });
      return setFilteredCategory(SearchAngilal);
    }
  };

  const setUpEditSub = (sub) => {
    setSubAngilalName(sub.name);
    setSubAngilalDesc(sub.content);
    setEditSubAngilal(true);
    setEditSubAngilalId(sub._id);
  };

  const resetSubAngilalForm = () => {
    setSubAngilalDesc("");
    setSubAngilalName("");
    setEditSubAngilal(false);
    setEditSubAngilalId("");
  };

  const SubAngilalEdit = async () => {
    try {
      let formdata = new FormData();
      formdata.append("name", subAngilalName);
      formdata.append("content", subAngilalDesc);
      const { data } = await axios.put(
        "/subangilal/" + editSubAngilalId,
        formdata
      );
      if (data.success) {
        resetSubAngilalForm();
        setRefreshKey((old) => old + 1);
        Swal.fire({
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
      });
    }
  };

  const deleteSubAngilal = async (sub) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${sub.name} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete("/subangilal/" + sub._id);
        if (data.success) {
          setRefreshKey((old) => old + 1);
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

  return (
    <Card
      style={{ marginLeft: "20px" }}
      extra={
        <Button
          onClick={() => {
            showModal(true);
            seteditCategory(false);
            resetCategory();
          }}
          icon={<PlusOutlined />}
        >
          Категори нэмэх
        </Button>
      }
    >
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
            {angilal
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="tableCell">
                    <h2>{row.name}</h2>
                  </TableCell>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
                      <img
                        src={`${CDNURL}/${row.link}`}
                        alt=""
                        className="image"
                      />
                      {row.product}
                    </div>
                  </TableCell>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
                      <button
                        onClick={() => setUpEditCategory(row)}
                        className="text-yellow-500 text-xl mx-2"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => categoryDelete(row)}
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
          count={angilal.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Modal
        title={editCategory ? "Ангилал засах" : "Ангилал нэмэх"}
        width={1000}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={editCategory ? "Засах" : "Үүсгэх"}
        onOk={editCategory ? () => CategoryEdit() : () => Categorycreate()}
      >
        <div className={`w-full flex ${editCategory && "h-96"}`}>
          <div className="w-3/6 flex justify-center items-center">
            <div className="w-full">
              <input
                onChange={(e) => {
                  if (e.target?.value) {
                    setName(e.target.value);
                  } else {
                    setName(null);
                  }
                }}
                value={Name}
                className="w-full p-2 border my-1"
                type="text"
                id="name"
                placeholder="name"
              />
              <input
                value={Description}
                onChange={(e) => {
                  if (e.target?.value) {
                    setDescription(e.target.value);
                  } else {
                    setDescription(null);
                  }
                }}
                className="w-full p-2 border my-1"
                type="text"
                id="description"
                placeholder="description"
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
          </div>
          {editCategory === false && (
            <div className="w-3/6">
              <input
                autoCapitalize="none"
                onChange={(e) => searchingCategory(e.target.value)}
                type={"search"}
                className="w-full p-2 border rounded-sm"
                placeholder="Ангилал хайх"
              />
              <div className="w-full h-[700px] overflow-auto">
                {FilteredCategory.map((item, index) => (
                  <div key={index} className="w-full border p-2 my-2 mx-auto">
                    <button
                      onClick={() => {
                        setDropDownAngilal(true);
                        setMatchingIndex(index);
                      }}
                      className="w-full flex flex-row gap-2 items-center"
                    >
                      <h1 className="text-black text-lg">
                        <PlusOutlined />
                      </h1>
                      <h1 className="text-black text-lg">{item.name}</h1>
                    </button>
                    {matchingIndex === index && dropDownAngilal && (
                      <div className="w-full h-96 overflow-auto">
                        <div className="w-full flex flex-col gap-1">
                          <div className="w-full flex flex-col gap-2">
                            <input
                              value={subAngilalName}
                              onChange={(e) =>
                                setSubAngilalName(e.target.value)
                              }
                              className="w-full border p-2"
                              placeholder="Дэд ангилал нэр"
                            />
                            <input
                              value={subAngilalDesc}
                              onChange={(e) =>
                                setSubAngilalDesc(e.target.value)
                              }
                              className="w-full border p-2"
                              placeholder="Дэд ангилал тайлбар"
                            />
                            <button
                              onClick={
                                editSubAngilal
                                  ? () => SubAngilalEdit()
                                  : () => createSubAngilal(item._id)
                              }
                              className="w-full bg-[#1990ff] p-2 text-white text-xl flex justify-center items-center"
                            >
                              {" "}
                              {editSubAngilal ? (
                                <EditOutlined />
                              ) : (
                                <PlusOutlined />
                              )}
                            </button>
                          </div>
                          <div className="w-full ">
                            {item?.SubAngilal?.map((item, index) => (
                              <div className="w-full p-2 hover:bg-gray-200 flex justify-between ">
                                <h1>{item.name}</h1>
                                <button onClick={() => setUpEditSub(item)}>
                                  Edit
                                </button>
                                <button onClick={() => deleteSubAngilal(item)}>
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default Datatable;
