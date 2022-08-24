import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { useEffect } from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState("");
  const navigate = useNavigate();

  const submitLogin = async () => {
    try {
      const { data } = await axios.post("login", {
        email: email,
        password: password.trim(),
      });
      if (data.token) {
        setSuccess(true);
        setData(data.token);
        Swal.fire({
          title: "WELCOME",
          text: data.user.email,
          icon: "success",
          confirmButtonText: "Continue",
        });
      }
    } catch (error) {
      Swal.fire({
        title: error.message,
        icon: "warning",
      });
      setSuccess(false);
    }
  };
  useEffect(() => {
    if (data) {
      localStorage.setItem("token", data);
      navigate("/admin/home");
    }
    if (localStorage.token) {
      navigate("/admin/home");
    }
  }, [data, navigate]);

  return (
    <div className="login">
      <div>
        <h2 className="text-center bold">City computer</h2>
      </div>
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
          label="Email "
          name={"email"}
          rules={[{ required: true, message: "  Имэйл хаяг оруулна уу" }]}
        >
          <Input
            placeholder="Таны email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Нууц үг"
          autoComplete={false}
          rules={[
            {
              required: true,
              message: "Та нууц үг ээ оруулна уу!",
            },
          ]}
        >
          <Input.Password
            autoComplete="off"
            value={password}
            placeholder="Нууц үг"
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            className="button"
            onClick={() => submitLogin()}
            type="primary"
            htmlType="submit"
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
