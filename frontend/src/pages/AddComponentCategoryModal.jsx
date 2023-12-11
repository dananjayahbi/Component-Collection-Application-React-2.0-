import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useFormik } from 'formik';

const AddComponentCategoryModal = ({ visible, onCancel, onSuccess }) => {
  const formik = useFormik({
    initialValues: {
      categoryName: '',
      description: '',
    },
    onSubmit: async (values) => {
      try {
        // Call the API to add a new category
        const response = await axios.post('http://localhost:5000/Categories/addCategory', values);

        // Trigger success callback and close the modal
        onSuccess(response.data);
        message.success("Category added successfully");
        window.location.reload();
        formik.resetForm();
        onCancel();
      } catch (error) {
        console.error('Error adding category:', error);
        message.error("Error adding category");
      }
    },
  });

  return (
    <Modal
      title="Add Component Category"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={formik.handleSubmit}>
          Add
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Component Name">
          <Input
            name="categoryName"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddComponentCategoryModal;
