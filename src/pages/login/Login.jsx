import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { Alert } from 'antd';
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState("")
  const navigate = useNavigate();


  const submitLogin = async () => {
    // let formdata = new FormData()
    // formdata.append("email", email)
    // formdata.append("password", password)
    try {
      const { data } = await axios.post("/admin/signin", { email: email, password: password })
      console.log(data.message)
      if (data.token) {
        setSuccess(true)
        setData(data.token)
      }
    } catch (error) {
      setSuccess(false)
    }
  };
  useEffect(() => {
    if (data) {
      localStorage.setItem("token", data);
      navigate("/home");
    }
    if (localStorage.token) {
      navigate("/home");
    }
  }, [data, navigate]);


  return (
    <div className="Login_container">
      <Form
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
        autoComplete="off"
      >
        <Form.Item
          autoComplete={false}
          label="Таны email"
          name="Таны email"
          rules={[
            {
              required: true,
              message: "Та email ээ оруулна уу!",
            },
          ]}
        >
          <Input autoComplete="none" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          autoComplete={false}
          label="Нууц үг"
          name="Нууц үг"
          rules={[
            {
              required: true,
              message: "Та нууц үг ээ оруулна уу!",
            },
          ]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button onClick={() => submitLogin()} type="primary" htmlType="submit">
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
      {success && <Alert message="Success Text" type="success" />}
    </div >
  );
};

export default Login;
