import "./datatable.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Space, Card } from "antd";
const { Column, ColumnGroup } = Table;

const Datatable = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const getUsersFromApi = async () => {
      const { data } = await axios.get("/getUsers");
      if (data.success) {
        setData(data.payload);
      }
    };
    getUsersFromApi();
  }, [refreshKey]);

  const showModal = () => {
    setVisible(true);
    setEditUser(false);
    form.resetFields();
  };

  const handleOk = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  const handleResetForm = () => {
    form.resetFields();
  };

  const registerUser = async (userRegisteration) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post("/signupUser", userRegisteration);
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
        title: "Хэрэглэгч бүртгэхэд алдаа гарлаа",
      });
    }
  };

  const EditUserHandle = async (user) => {
    setEditUserId(user._id);
    console.log(user);
    form.setFieldsValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    setVisible(true);
    setEditUser(true);
  };

  const editUserApi = async (userEditedForm) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post(
        `/updateUser/${editUserId}`,
        userEditedForm
      );
      if (data.success) {
        setEditUserId(false);
        setEditUser(false);
        setRefreshKey((old) => old + 1);
        setVisible(false);
        setConfirmLoading(false);
        form.resetFields();
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
        title: "Хэрэглэгчийн мэдээлэл засахад алдаа гарлаа",
      });
    }
  };

  const deleteHandle = async (userId) => {
    try {
      const { data } = await axios.delete(`/deleteUser/${userId}`);
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
        title: "Хэрэглэгч устгахад алдаа гарлаа",
      });
    }
  };

  return (
    <div className="datatable">
      <Card hoverable style={{ width: "1200px", height: "600px" }}>
        <div className="datatableTitle">
          Нийт хэрэглэгч
          <Button type="primary" onClick={showModal}>
            ХЭРЭГЛЭГЧ НЭМЭХ
          </Button>
        </div>
        <Table dataSource={data}>
          <ColumnGroup title="Name">
            <Column title="First Name" dataIndex="firstName" key="firstName" />
            <Column title="Last Name" dataIndex="lastName" key="lastName" />
          </ColumnGroup>
          <Column title="Email" dataIndex="email" key="email" />
          <Column
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <button onClick={() => EditUserHandle(record)}>Edit</button>
                <button onClick={() => deleteHandle(record._id)}>Delete</button>
              </Space>
            )}
          />
        </Table>

        <Modal
          title={editUser ? "Хэрэглэгч засах" : "Хэрэглэгч бүртгэх"}
          visible={visible}
          okText={
            editUser ? (
              <h1 style={{ color: "white" }}>Засах</h1>
            ) : (
              <h1 style={{ color: "white" }}>Бүртгэх</h1>
            )
          }
          onOk={editUser ? editUserApi : registerUser}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          {/* <Button onClick={handleResetForm}>Reset Form</Button> */}
          <Form
            form={form}
            initialValues={{
              lastName: "",
              firstName: "",
              password: "",
              email: "",
            }}
            encType="multipart/formdata"
            onFinish={editUser ? editUserApi : registerUser}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            autoComplete="do-not-autofill"
          >
            <Form.Item
              label="Firstname"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input your Firstname!",
                },
              ]}
            >
              <Input placeholder="Firstname" autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Lastname"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input your Lastname!",
                },
              ]}
            >
              <Input placeholder="Lastname" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input placeholder="Email" autoComplete="off" />
            </Form.Item>
            {editUser === false && (
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input.Password placeholder="password" autoComplete="off" />
              </Form.Item>
            )}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              {editUser ? (
                <Button block type="primary" htmlType="submit">
                  Edit
                </Button>
              ) : (
                <Button block type="primary" htmlType="submit">
                  Submit
                </Button>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Datatable;
