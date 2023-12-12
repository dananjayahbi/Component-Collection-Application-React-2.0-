import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useFormik } from 'formik';

const EditRefImageCategoryModal = ({ visible, categoryId, onCancel, onSuccess }) => {
  const [initialValues, setInitialValues] = useState({
    categoryName: '',
    description: '',
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      try {
        // Call the API to update the category
        await axios.put(`http://localhost:5000/refImageCategories/updateRefImageCategory/${categoryId}`, values);

        // Trigger success callback and close the modal
        onSuccess();
        message.success("Category updated successfully");
        formik.resetForm();
        window.location.reload();
        onCancel();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    },
  });

  useEffect(() => {
    // Fetch category details when the modal is opened
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/refImageCategories/getRefImageCategory/${categoryId}`);
        setInitialValues(response.data);
        formik.setValues(response.data);
      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };

    if (visible) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  return (
    <Modal
      title="Edit RefImage Category"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={formik.handleSubmit}>
          Save Changes
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="RefImage Name">
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

export default EditRefImageCategoryModal;
