import React, { useState } from "react";
import { Button, Form, Input, Select, notification, DatePicker } from "antd";
import { Project } from "./TablePage";

const AddProductForm = (props: {
  closeModal: () => void,
  showNotification: (message: string) => void,
	setRecord: React.Dispatch<React.SetStateAction<Project | undefined>>,
  changeCSS: () => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  // function takes info from form and sends it to API, if good it will clear modal and form and show the product added
  const onFinish = async (values: any) => {
    setLoading(true);
    const developers = [];
    for (let i = 1; i < 6; i++) {
      if (values["developer" + i.toString()]) {
        developers.push(values["developer" + i.toString()]);
      }
    }

    // Ensure correct date format
    const dateFormated = values.startDate.format("YYYY/MM/DD");

    try {
      const response = await fetch(`http://localhost:3000/api/addProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: values.productName,
          productOwnerName: values.productOwnerName,
          Developers: developers,
          scrumMasterName: values.scrumMasterName,
          startDate: dateFormated,
          methodology: values.methodology,
          location: values.location
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoading(false)
      props.closeModal();
      form.resetFields();
      props.showNotification(responseData.message);
			props.setRecord(responseData.record);
			props.changeCSS()
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
        initialValue=""
        labelCol={{ span: 6 }}
        label="Product Name"
        name="productName"
        rules={[{ required: true, message: "Please input a Product Name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Scrum Master"
        name="scrumMasterName"
        rules={[{ required: true, message: "Please input a Scrum Master" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Product Owner"
        name="productOwnerName"
        rules={[{ required: true, message: "Please input a Product Owner" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Developer #1"
        name="developer1"
        rules={[{ required: true, message: "Please input a Developer" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Developer #2"
        name="developer2"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Developer #3"
        name="developer3"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Developer #4"
        name="developer4"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Developer #5"
        name="developer5"
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Please select a Start Date" }]}
      >
        <DatePicker format={"YYYY/MM/DD"} />
      </Form.Item>
      <Form.Item
        initialValue=""
        labelCol={{ span: 6 }}
        label="Methodology"
        name="methodology"
        rules={[{ required: true, message: "Please choose a Methodology" }]}
      >
        <Select
          defaultValue=""
          style={{ width: 120 }}
          options={[
            { value: "Agile", label: "Agile" },
            { value: "Waterfall", label: "Waterfall" },
          ]}
        />
      </Form.Item>
      <Form.Item
        initialValue={""}
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

export default AddProductForm;
