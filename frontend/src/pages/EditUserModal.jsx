import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

const EditUserModal = ({ visible, onCancel, userId, getUsers }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/getUser/${userId}`
        );
        const userData = response.data;
        form.setFieldsValue({
          username: userData.username,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (visible) {
      fetchUserData();
    }
  }, [visible, userId, form]);

  const handleUpdateUser = async (values) => {
    try {
      if (values.password === "") {
        delete values.password;
        delete values.confirmPassword;
      }
      await axios.put(
        `http://localhost:5000/users/updateUser/${userId}`,
        values
      );
      message.success("User updated successfully");
      getUsers();
      onCancel();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Something went wrong!");
    }
  };

  return (
    <Modal
      title="Edit User"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleUpdateUser}
        initialValues={{ password: "", confirmPassword: "" }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input the username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input the email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="New Password" name="password">
          <Input.Password />
        </Form.Item>
        <Form.Item label="Confirm New Password" name="confirmPassword">
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Update User
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
