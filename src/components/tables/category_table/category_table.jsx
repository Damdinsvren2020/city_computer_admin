import * as React from "react";

import "./category_table.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";

import axios from "axios";
import Swal from "sweetalert2";
import { CDNURL } from "../../../CDNURL";

const Datatable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editCategory, seteditCategory] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [angilal, setAngilal] = useState([]);
  const [image, setImage] = useState(null);

  const [dropDownAngilal, setDropDownAngilal] = useState(false);
  const [matchingIndex, setMatchingIndex] = useState("");
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");

  useEffect(() => {
    axios
      .get("/angilal")
      .then((response) => {
        const data = response.data.data;
        setAngilal(data);
        setFilteredCategory(data);
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

  const [subAngilalName, setSubAngilalName] = useState("");
  const [subAngilalDesc, setSubAngilalDesc] = useState("");
  const [FilteredCategory, setFilteredCategory] = useState([]);

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

  return (
    <Card
      style={{ marginLeft: "20px" }}
      extra={
        <Button onClick={() => showModal(true)} icon={<PlusOutlined />}>
          Баннер нэмэх
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
            {angilal.map((row) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            <div className="w-full h-48">
              <input
                onChange={(e) => {
                  if (e.target?.value) {
                    setName(e.target.value);
                  } else {
                    setName(null);
                  }
                }}
                className="w-full p-2 border my-1"
                type="text"
                id="name"
                placeholder="name"
              />
              <input
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
                id="avatar"
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
              {editCategory ? (
                <Button type="primary" htmlType="Үүсгэх">
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={() => Categorycreate()}
                  type="primary"
                  htmlType="Үүсгэх"
                >
                  Үүсгэх
                </Button>
              )}
            </div>
          </div>
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
                            onChange={(e) => setSubAngilalName(e.target.value)}
                            className="w-full border p-2"
                            placeholder="Дэд ангилал нэр"
                          />
                          <input
                            value={subAngilalDesc}
                            onChange={(e) => setSubAngilalDesc(e.target.value)}
                            className="w-full border p-2"
                            placeholder="Дэд ангилал тайлбар"
                          />
                          <button
                            onClick={() => createSubAngilal(item._id)}
                            className="w-full bg-[#1990ff] p-2 text-white text-xl flex justify-center items-center"
                          >
                            {" "}
                            <PlusOutlined />
                          </button>
                        </div>
                        <div className="w-full ">
                          {item?.SubAngilal?.map((item, index) => (
                            <div className="w-full p-2 hover:bg-gray-200">
                              <h1>{item.name}</h1>
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
        </div>
      </Modal>
    </Card>
  );
};

export default Datatable;
