import React, { useState } from "react";
import { Button, Form, Input, Select, notification } from "antd";
import { Project } from "./TablePage";

const EditProductForm = (props: {
  record: Project;
  closeModal: () => void;
  showNotification: (message: string) => void;
  changeCSS: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  // function takes info from form and sends it to API, if good it will clear modal and form and show where the change was made
  const onFinish = async (values: any) => {
    setLoading(true)
    let count = 0;
    // To ensure atleast one is filled out
    for (const value in values) {
      if (values[value]) {
        count = count + 1;
      }
    }
    if (count === 0) {
      api.error({
        message: "need at least one value filled out",
        placement: "top",
      });
      throw new Error("need at least one value filled out");
    }
    const developers = [];
    for (let i = 1; i < 6; i++) {
      if (values["developer" + i.toString()]) {
        developers.push(values["developer" + i.toString()]);
      }
    }

    try {
      if (!props.record) {
        throw new Error("No record found");
      }
      const response = await fetch(`http://localhost:3000/api/editProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: props.record.productId,
          productName: values.productName,
          productOwnerName: values.productOwnerName,
          Developers: developers,
          scrumMasterName: values.scrumMasterName,
          methodology: values.methodology,
          location: values.location
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoading(false)
      form.resetFields();
      props.closeModal();
      props.showNotification(responseData.message);
      props.changeCSS();
    } catch (err: any) {
      setLoading(false)
      api.error({
        message: err.message,
        placement: "top",
      });
    }
  };
  return (
    <Form
      name="basic"
      form={form}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {contextHolder}
      <Form.Item
        initialValue={props.record.productName}
        labelCol={{ span: 6 }}
        label="Product Name"
        name="productName"
        rules={[{ required: true, message: "Please input a Product Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 6 }}
        label="Scrum Master"
        name="scrumMasterName"
        initialValue={props.record.scrumMasterName}
        rules={[{ required: true, message: "Please input a Scrum Master" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.productOwnerName}
        labelCol={{ span: 6 }}
        label="Product Owner"
        name="productOwnerName"
        rules={[{ required: true, message: "Please input a Product Owner" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.Developers[0]}
        labelCol={{ span: 6 }}
        label="Developer #1"
        name="developer1"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.Developers[1]}
        labelCol={{ span: 6 }}
        label="Developer #2"
        name="developer2"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.Developers[2]}
        labelCol={{ span: 6 }}
        label="Developer #3"
        name="developer3"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.Developers[3]}
        labelCol={{ span: 6 }}
        label="Developer #4"
        name="developer4"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.Developers[4]}
        labelCol={{ span: 6 }}
        label="Developer #5"
        name="developer5"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={props.record.methodology}
        labelCol={{ span: 6 }}
        label="Methodology"
        name="methodology"
        rules={[{ required: true, message: "Please choose a Methodology" }]}
      >
        <Select
          style={{ width: 120 }}
          options={[
            { value: "Agile", label: "Agile" },
            { value: "Waterfall", label: "Waterfall" },
          ]}
        />
      </Form.Item>
      <Form.Item
        initialValue={props.record.location}
        labelCol={{ span: 6 }}
        label="Location"
        name="location"
        rules={[{ required: true, message: "Please enter a Location" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button loading={loading} type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProductForm;
