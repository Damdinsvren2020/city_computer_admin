import React, { useEffect, useState } from "react";
import "./contact.scss";

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

const Contact_table = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [contact, setContact] = useState([]);
  const [address, setAddress] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [email, setEmail] = useState("");
  const [delivery_content, setDelivery_content] = useState("");
  const [facebook_link, setFacebook_link] = useState("");
  const [instagram_link, setInstagram_link] = useState("");
  const [email_link, setEmail_link] = useState("");

  useEffect(() => {
    axios
      .get("/contact")
      .then((response) => {
        const data = response.data.data;
        setContact(data);
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
      formdata.append("address", address);
      formdata.append("email", email);
      formdata.append("phone_number", phone_number);
      formdata.append("delivery_content", delivery_content);
      formdata.append("facebook_link", facebook_link);
      formdata.append("instagram_link", instagram_link);
      formdata.append("email_link", email_link);
      const { data } = await axios.post("contact_create", formdata);
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

  const deleteHandler = async (contact) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${contact.email} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`contact/${contact._id}`);
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
    setAddress("");
    setEmail("");
    setDelivery_content("");
    setFacebook_link("");
    setInstagram_link("");
    setEmail_link("");
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
          Холбоо барих нэмэх
        </Button>
      }
    >
      <TableContainer className="table">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Хаяг</TableCell>
              <TableCell className="tableCell">Утасны дугаар</TableCell>
              <TableCell className="tableCell">Email</TableCell>
              <TableCell className="tableCell">Хүргэлт гарчиг</TableCell>
              <TableCell className="tableCell">Facebook</TableCell>
              <TableCell className="tableCell">Instagram</TableCell>
              <TableCell className="tableCell">Email link</TableCell>
              <TableCell className="tableCell">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contact.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="tableCell">
                  <h2>{row.address}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.phone_number}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.email}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.delivery_content}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.facebook_link}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.instagram_link}</h2>
                </TableCell>
                <TableCell className="tableCell">
                  <h2>{row.email_link}</h2>
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
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Хаяг"
          />
          <input
            type={"number"}
            value={phone_number}
            onChange={(e) => setPhone_number(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Утасны дугаар"
          />
          <input
            type={"text"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Email хаяг"
          />
          <input
            type={"text"}
            value={delivery_content}
            onChange={(e) => setDelivery_content(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Хүргэлт текст"
          />
          <input
            type={"text"}
            value={facebook_link}
            onChange={(e) => setFacebook_link(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Facebook link"
          />
          <input
            type={"text"}
            value={instagram_link}
            onChange={(e) => setInstagram_link(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Instagram link"
          />
          <input
            type={"text"}
            value={email_link}
            onChange={(e) => setEmail_link(e.target.value)}
            className="w-full p-2 border my-1"
            placeholder="Email link"
          />
        </div>
      </Modal>
    </Card>
  );
};

export default Contact_table;
