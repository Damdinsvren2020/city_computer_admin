import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { useEffect } from "react";
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
      setSuccess(false);
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
          label="Таны email"
          name="Таны email"
          rules={[
            {
              required: true,
              message: "Та email ээ оруулна уу!",
            },
          ]}
        >
          <Input
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            autoComplete="off"
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
          <Button
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
