import "./datatable.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Space, Card } from "antd";
const { Column } = Table;

const Datatable = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const getUsersFromApi = async () => {
      const { data } = await axios.get("/users");

      if (data.success) {
        setData(data.users);
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
      const { data } = await axios.post("/register", userRegisteration);
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
      username: user.username,
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
    <Card
      title="Хэрэглэгч"
      style={{ marginLeft: "20px" }}
      extra={
        <Button onClick={() => showModal(true)} icon={<PlusOutlined />}>
          Хэрэглэгч нэмэх
        </Button>
      }
    >
      <Table dataSource={data}>
        <Column title="Хэрэглэгчийн нэр" dataIndex="username" key="username" />
        <Column title="role" dataIndex="role" key="role" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column
          title="Үйлдэл"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <button onClick={() => EditUserHandle(record)}>Засах</button>
              <button onClick={() => deleteHandle(record._id)}>Устгах</button>
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
            username: "",
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
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input placeholder="Username" autoComplete="off" />
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
            <Input
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="role"
            name="role"
            rules={[
              {
                required: true,
                message: "Талбарыг бөглөнө үү",
              },
            ]}
          >
            <Input
              placeholder="Талбарыг бөглөнө үү"
              autoComplete="off"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
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
              <Input.Password
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
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
  );
};

export default Datatable;
