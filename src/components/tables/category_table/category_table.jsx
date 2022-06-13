import "./category_table.scss";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Tag, Space } from "antd";
const { Column, ColumnGroup } = Table;

const Datatable = () => {
  const [data, setData] = useState([]);

  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [editCategory, seteditCategory] = useState(false);
  const [editCategoryId, seteditCategoryId] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const getUsersFromApi = async () => {
      const { data } = await axios.get("/category/getcategory");
      console.log("category ", data.payload);
      if (data.success) {
        setCategoryList(data.payload);
      }
    };
    getUsersFromApi();
  }, [refreshKey]);

  const showModal = () => {
    setVisible(true);
    seteditCategory(false);
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

  const Category = async (form) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post("/category/create", form);
      if (data.success) {
        setVisible(false);
        setConfirmLoading(false);
        setRefreshKey((old) => old + 1);
        new Swal({
          icon: "success",
          title: "Амжилттай",
        });
      }
      if (!data.success) {
        setConfirmLoading(false);
        new Swal({
          icon: "error",
          title: "Алдаа",
        });
      }
    } catch (error) {
      setConfirmLoading(false);
      console.log(error);
    }
  };

  const editCategoryHandle = async (category) => {
    seteditCategoryId(category._id);
    console.log(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
    });
    setVisible(true);
    seteditCategory(true);
  };

  const editCategoryApi = async (editCategoryForm) => {
    setConfirmLoading(true);
    try {
      const { data } = await axios.post(
        `/updateUser/${editCategoryId}`,
        editCategoryForm
      );
      if (data.success) {
        seteditCategoryId(false);
        seteditCategory(false);
        setRefreshKey((old) => old + 1);
        setVisible(false);
        setConfirmLoading(false);
        form.resetFields();
        new Swal({
          icon: "success",
          name: data.result,
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
        title: "Ангилалийн мэдээлэл засахад алдаа гарлаа",
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
        title: "Ангилал устгахад алдаа гарлаа",
      });
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Нийт Ангилал
        <Button type="primary" onClick={showModal}>
          Нэмэх
        </Button>
      </div>

      <Table dataSource={categoryList}>
        <Column>
          <Column title="Ангилалын нэр" dataIndex="name" key="name" />
        </Column>
        <Column
          title="Үйлдэл"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <button onClick={() => editCategoryHandle(record)}>Засах</button>
              <button onClick={() => deleteHandle(record._id)}>Усгтах</button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editCategory ? "Ангилал засах" : "Ангилал бүртгэх"}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          initialValues={{
            name: "",
            slug: "",
          }}
          encType="multipart/formdata"
          onFinish={editCategory ? editCategoryApi : Category}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          autoComplete="do-not-autofill"
        >
          <Form.Item
            label="name"
            name="name"
            rules={[
              {
                required: true,
                message: "Ангилалын нэр ээ оруулна уу!",
              },
            ]}
          >
            <Input placeholder="name" autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="slug"
            name="slug"
            rules={[
              {
                required: true,
                message: "Та slug аа оруулна уу!",
              },
            ]}
          >
            <Input placeholder="slug" autoComplete="off" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            {editCategory ? (
              <Button block type="primary" htmlType="submit">
                Edit
              </Button>
            ) : (
              <Button block type="primary" htmlType="submit">
                Button
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Datatable;
