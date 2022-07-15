import React, { useState } from "react";
import {
  Modal,
  Form,
  Row,
  Input,
  InputNumber,
  Upload,
  message,
  Col,
  Select,
} from "antd";
import { OrderedListOutlined } from "@ant-design/icons";

const bannerModal = () => {
  return (
    <Modal
      //   title={banner._id ? "Ангилал засах" : "Ангилал нэмэх"}
      width={380}
      //   visible={bannerModal}
      okText="Хадгалах"
      cancelText="Болих"
      //   confirmLoading={bannerLoading}
      maskClosable={false}
    >
      <Form
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        autoComplete="off"
        layout="vertical"
      >
        <Row>
          <Col span={24}></Col>
          <Col span={24}>
            <Form.Item label="Линк">
              <Input
                style={{ width: "100%" }}
                type="text"
                // value={banner.link}
                name="link"
              />
            </Form.Item>
            <Row gutter={[12, 12]}>
              <Col span={8}>
                <Form.Item label="Дараалал">
                  <InputNumber
                    style={{ width: "100%" }}
                    type="text"
                    name="orders"
                    addonBefore={<OrderedListOutlined />}
                    min={1}
                    max={11}
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="Байршил">
                  <Select
                    // labelInValue
                    defaultValue={{ value: "home" }}
                    name="type"
                  >
                    <Select.Option value="home">Home</Select.Option>
                    <Select.Option value="more">More</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default bannerModal;
