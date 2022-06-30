import { useEffect, useState } from "react";
import "./banner_table.scss";
import { Modal, Result } from "antd";
import { Form, Button, Card, Column } from "antd";

import axios from "axios";
// import Swal from "sweetalert2";
import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log("search:", value);
};
const Datatable = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editCategory, seteditCategory] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [picturesList, setPictureList] = useState([]);
  useEffect(() => {
    const getBanner = async () => {
      const { data } = await axios.get("banner/getAll");
      console.log("datas", data);
      setPictureList(data.data);
    };
    getBanner();
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

  function deleteBanner(id) {
    fetch(`http://localhost:3001/bannerDelete/${id}`, {
      method: "DELETE",
    }).then((result) =>
      result.json().then((resp) => {
        console.log("Data ustgah", resp);
      })
    );
  }
  useEffect(() => {
    const getBannerDelete = async () => {
      const { data } = await axios.delete("bannerDelete/");
      console.log("datas", data);
      setPictureList(data.data);
    };
    getBannerDelete();
  }, []);
  const props = {
    name: "image",
    action: "http://localhost:3001/api/banner",
    headers: {
      authorization: "Bearer " + localStorage.getItem("token"),
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
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
        Нийт Баннер
        <Button type="primary" onClick={showModal}>
          Нэмэх
        </Button>
      </div>
      <Card hoverable>
        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="tableCell">Зураг</TableCell>
                <TableCell className="tableCell">Үйлдэл</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {picturesList.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="tableCell">
                    <div className="cellWrapper">
                      <img
                        src={"http://localhost:3001" + row.link}
                        alt=""
                        className="image"
                      />
                      {row.product}
                    </div>
                  </TableCell>
                  <button onClick={() => deleteBanner()}>Delete</button>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Modal
        title={editCategory ? "Ангилал засах" : "Баннер оруулах"}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: true,
        }}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default Datatable;
