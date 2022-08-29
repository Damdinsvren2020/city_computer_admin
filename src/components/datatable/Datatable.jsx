import "./datatable.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, Table, Space, Card, Select } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
const { Column } = Table;

const Datatable = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [userEditId, setUserEditId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editUserId, setEditUserId] = useState("");

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

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
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
      role: user.role,
      username: user.username,
      password: user.password,
    });
    setVisible(true);
    setEditUser(true);
  };

  const editUsersok = async () => {
    try {
      let formdata = new FormData();
      formdata.append("username", username);
      formdata.append("email", email);
      formdata.append("role", role);
      formdata.append("password", password);
      const { data } = await axios.put("/usersEdit/" + editUserId, formdata);
      if (data.success) {
        setEditLoading(false);
        resetForm();
        setRefreshKey((old) => old + 1);
        showModal(false);
        Swal.fire({
          icon: "success",
          title: "Засагдлаа",
        });
      }
    } catch (error) {
      setEditLoading(false);
      Swal.fire({
        icon: "error",
        title: "Алдаа гарлаа",
        text: error.message,
      });
    }
  };

  const deleteHandler = async (user) => {
    Swal.fire({
      title: `Та итгэлтэй байна уу ?`,
      text: `${user.username} ыг устгах гэж байна!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Болих",
      confirmButtonText: "Устгах",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await axios.delete(`/usersdelete/${user._id}`);
        console.log("dattt", data);
        if (data.success) {
          setRefreshKey((old) => old + 1);
          setEditUserId(false);
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

  const { Option } = Select;
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <Card
      title="Хэрэглэгч"
      style={{ marginLeft: "20px" }}
      // extra={
      //   <Button onClick={() => showModal(true)} icon={<PlusOutlined />}>
      //     Хэрэглэгч нэмэх
      //   </Button>
      // }
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
              <button onClick={() => deleteHandler(record)}>Устгах</button>
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
        onOk={editUser ? editUsersok : registerUser}
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
          onFinish={editUser ? editUsersok : registerUser}
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
          {/* <Form.Item
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
          </Form.Item> */}

          <Form.Item
            label="Эрх оруулах"
            name="Эрх оруулах"
            rules={[
              {
                required: true,
                message: "Хэрэглэгчийн эрхийг оруулна уу",
              },
            ]}
          >
            <Select
              defaultValue=""
              style={{
                width: 314,
              }}
              onChange={handleChange}
            >
              <Option value="">Админ</Option>
              <Option value="">Хэрэглэгч</Option>
            </Select>
          </Form.Item>

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
