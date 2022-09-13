import React, { useEffect, useState } from "react";
import "./about.scss";

import { Modal } from "antd";
import { Button, Card } from "antd";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";

const About_table = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [about, setAbout] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [point, setPoint] = useState("");
  const [price, setPrice] = useState("");
  const [advantage, setAdvantage] = useState("");
  const [partner, setPartner] = useState("");

  useEffect(() => {
    axios
      .get("about")
      .then((response) => {
        const data = response.data.data;
        console.log("dafogjraj", response.data);
        setAbout(data);
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

  const createContact = async () => {
    try {
      let formdata = new FormData();
      formdata.append("title", title);
      formdata.append("description", description);
      formdata.append("point", point);
      formdata.append("price", price);
      formdata.append("advantage", advantage);
      formdata.append("partner", partner);
      const { data } = await axios.post("about_create", formdata);
      if (data.success) {
        setVisible(false);
        setConfirmLoading(false);
        setRefreshKey((old) => old + 1);
        new Swal({
          icon: "success",
          title: "Амжилттай нэмэгдлээ",
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
        title: "Алдаа гарлаа",
      });
    }
  };

  const deleteHandler = async (about) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${about.point} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`about/${about._id}`);
        if (data.success) {
          setRefreshKey((old) => old + 1);
          resetform();
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
    setPoint("");
    setPrice("");
    setAdvantage("");
    setPartner("");
  };

  return (
    <Card
      style={{ marginLeft: "20px" }}
      className="overflow-auto"
      extra={
        <Button
          onClick={() => {
            showModal(true);

            resetform();
          }}
          icon={<PlusOutlined />}
        >
          Нэмэх
        </Button>
      }
    >
      <TableContainer className="table">
        <Table aria-label="simple table" className="overflow-auto">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Гарчиг</TableCell>
              <TableCell className="tableCell">Тайлбар</TableCell>
              <TableCell className="tableCell">Зорилго</TableCell>
              <TableCell className="tableCell">Үнэт зүйл</TableCell>
              <TableCell className="tableCell">Давуу тал</TableCell>
              <TableCell className="tableCell">Хамтрагч байгууллага</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {about.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="tableCell">
                  <h2>{row.title}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.description}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.point}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.price}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.advantage}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.partner}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <div>
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
        width={380}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={"Үүсгэх"}
        onOk={() => createContact()}
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
          <input
            type={"text"}
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Зорилго"
          />
          <input
            type={"text"}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Үнэт зүйл"
          />
          <input
            type={"text"}
            value={advantage}
            onChange={(e) => setAdvantage(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Давуу тал"
          />
          <input
            type={"text"}
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Хамтрагч байгууллага"
          />
        </div>
      </Modal>
    </Card>
  );
};

export default About_table;
