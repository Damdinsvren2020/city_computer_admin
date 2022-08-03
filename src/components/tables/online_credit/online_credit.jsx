import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { CDNURL } from "../../../CDNURL";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const OnlineCreditTable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [onlinecredit, setOnlineCredit] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [editonlinecreditId, setEditCreditId] = useState("");
  const [newImage, setNewImage] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [requirement, setRequirement] = useState("");
  const [condition, setConditon] = useState("");
  const [editForm, setEditForm] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios
      .get("/onlinecredit")
      .then((response) => {
        const data = response.data.data;
        console.log("images", data);
        setOnlineCredit(data);
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

  const createOnlineCategory = async () => {
    try {
      let formdata = new FormData();
      formdata.append("title", title);
      formdata.append("description", description);
      formdata.append("material", material);
      formdata.append("requirement", requirement);
      formdata.append("condition", condition);
      formdata.append("thumbnail", image[0]);
      const { data } = await axios.post("/onlinecredit", formdata);
      if (data.success) {
        setVisible(false);
        setConfirmLoading(false);
        setRefreshKey((old) => old + 1);
        new Swal({
          icon: "success",
          title: data.data,
        });
      }
      if (!data.success) {
        setConfirmLoading(false);
        new Swal({
          icon: "error",
          title: data.data,
        });
      }
    } catch (error) {
      setConfirmLoading(false);
      console.log(error);
      new Swal({
        icon: "error",
        title: "Лизингийн мэдээлэл үүсгэхэд алдаа гарлаа",
      });
    }
  };

  const editOnlineCreditHandler = async () => {
    setConfirmLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("title", title);
      formdata.append("description", description);
      formdata.append("material", material);
      formdata.append("requirement", requirement);
      formdata.append("condition", condition);
      newImage
        ? formdata.append("thumbnail", image[0])
        : formdata.append("thumbnailOld", image);
      newImage && formdata.append("newThumbnail", photo);
      const { data } = await axios.put(
        `onlinecredit/${editonlinecreditId}`,
        formdata
      );
      console.log("file zasah", data);
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
        title: "Лизингийн мэдээлэл засахад алдаа гарлаа",
      });
    }
  };

  const deleteHandler = async (onlinecredit) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${onlinecredit.title} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(
          `/onlinecredit/${onlinecredit._id}`
        );

        if (data.success) {
          setRefreshKey((old) => old + 1);
          resetform();
          setEditCreditId(false);
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
    setTitle("");
    setDescription("");
    setMaterial("");
    setRequirement("");
    setConditon("");
    setPhoto(null);
    setImage(null);
  };

  return (
    <Card
      style={{ marginLeft: "20px" }}
      extra={
        <Button
          onClick={() => {
            showModal(true);
            setEditCreditId(false);
          }}
          icon={<PlusOutlined />}
        >
          Лизингийн мэдээлэл
        </Button>
      }
    >
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Гарчиг</TableCell>
              <TableCell className="tableCell">Тайлбар</TableCell>
              <TableCell className="tableCell"> Зураг</TableCell>
              <TableCell className="tableCell">Бүрдүүлэх материал</TableCell>
              <TableCell className="tableCell">Тавигдах шаардлага</TableCell>
              <TableCell className="tableCell">Нөхцөл</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onlinecredit.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="tableCell">
                  <h2>{row.title}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.description}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    <img
                      src={`${CDNURL}/${row.photo}`}
                      alt=""
                      className="photo w-48 h-48 object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.material}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.requirement}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.condition}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
                    <button
                      className="text-yellow-500 text-xl mx-2"
                      onClick={() => editOnlineCreditHandler(row)}
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
        title={editForm ? "лизинг" : "лизинг "}
        width={780}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={editForm ? "Засах" : "Үүсгэх"}
        onOk={
          editForm
            ? () => editOnlineCreditHandler()
            : () => createOnlineCategory()
        }
      >
        <div className="w-full h-96">
          <input
            type={"text"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Гарчиг"
          />
          <input
            type={"text"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Тайлбар"
          />
          <h2>Бүрдүүлэх материал</h2>
          <CKEditor
            editor={ClassicEditor}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setMaterial(data);
            }}
          />

          <h2>Тавигдах шаардлага</h2>
          <CKEditor
            editor={ClassicEditor}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setRequirement(data);
            }}
          />
          <h2>Ерөнхий нөхцөл</h2>
          <CKEditor
            editor={ClassicEditor}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setConditon(data);
            }}
          />
        </div>
        <div className="w-full flex flex-wrap gap-2 mt-20 w-48 h-48">
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
                    : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-photo-icon-loading-photos-vector-37375020.jpg"
                  : "https://cdn1.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-photo-icon-loading-photos-vector-37375020.jpg"
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={`${CDNURL}/${image}`}
              alt="photo"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default OnlineCreditTable;
