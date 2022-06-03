import "./datatable.scss"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
import axios from "axios"
import Swal from 'sweetalert2'
import { Table, Tag, Space } from 'antd';
const { Column, ColumnGroup } = Table;

const Datatable = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm()

  const [visible, setVisible] = useState(false);
  const [editUser, setEditUser] = useState(false)
  const [editUserId, setEditUserId] = useState("")
  const [confirmLoading, setConfirmLoading] = useState(false);

  //form for registering user

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  useEffect(() => {
    const getUsersFromApi = async () => {
      const { data } = await axios.get("/getUsers")
      if (data.success) {
        setData(data.payload)
      }
    }
    getUsersFromApi()
  }, [])

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
    resetForm()
  };

  const handleCancel = () => {
    setVisible(false);
    resetForm()
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const registerUser = async () => {
    setConfirmLoading(true)
    // let formdata = new FormData()
    // formdata.append("email", email)
    // formdata.append("firstname", firstname)
    // formdata.append("lastname", lastname)
    // formdata.append("password", password)
    try {
      const { data } = await axios.post("/signupUser", { email: email, firstName: firstname, lastName: lastname, password: password })
      if (data.success) {
        resetForm()
        setVisible(false)
        setConfirmLoading(false)
        new Swal({
          icon: "success",
          title: "Хэрэглэгч бүртгэглээ"
        })
      }
    } catch (error) {
      setConfirmLoading(false)
      new Swal({
        icon: "error",
        title: "Бүртгэхэд алдаа гарсан"
      })
    }
  }

  const EditUserHandle = async (user) => {
    setEditUserId(user._id)
    form.setFieldsValue({
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName
    });
    setVisible(true)
    setEditUser(true)
  }

  const editUserApi = async () => {

  }

  const resetForm = () => {
    setEmail("")
    setFirstname("")
    setLastname("")
    setPassword("")
  }


  return (
    <div className="datatable">
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
        {/* <Column
          title="status"
          dataIndex="status"
          key="status"
          render={(status) => (
            <>
              {status.map((status) => (
                <Tag color="blue" key={status}>
                  {status}
                </Tag>
              ))}
            </>
          )}
        /> */}
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <button onClick={() => EditUserHandle(record)}>Edit</button>
              <button>Delete</button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editUser ? "Хэрэглэгч засах" : "Хэрэглэгч бүртгэх"}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          onFinish={editUser ? () => editUserApi() : () => registerUser()}
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Firstname"
            name="Firstname"
            rules={[
              {
                required: true,
                message: 'Please input your Firstname!',
              },
            ]}
          >
            <Input autoComplete={false} value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="Lastname"
            rules={[
              {
                required: true,
                message: 'Please input your Lastname!',
              },
            ]}
          >
            <Input autoComplete={false} value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            autoComplete={false}
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input autoComplete={false} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          {
            editUser === false &&
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>
          }
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {
              editUser ?
                <Button onClick={() => editUserApi()} type="primary" htmlType="submit">
                  Edit
                </Button>
                :
                <Button onClick={() => registerUser()} type="primary" htmlType="submit">
                  Submit
                </Button>
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Datatable;
