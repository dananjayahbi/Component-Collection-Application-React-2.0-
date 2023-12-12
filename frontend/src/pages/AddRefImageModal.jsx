import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Typography, message, Select } from 'antd';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  imageURL: Yup.string().url('Invalid URL').required('Image URL is required'),
  category: Yup.string().required('Category is required'),
});

const AddRefImageModal = () => {
  const [categories, setCategories] = useState([]);
  const [imageUrlPreview, setImageUrlPreview] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/refImageCategories/getAllRefImageCategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUrlBlur = (event) => {
    const imageUrl = event.target.value;
    setImageUrlPreview(imageUrl);
  };

  const formik = useFormik({
    initialValues: {
      imageURL: '',
      category: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Call the API to add a new Ref. Image
        await axios.post('http://localhost:5000/refImages/addRefImage', values);

        // Trigger success callback and close the modal
        message.success("Ref. Image added successfully");
        window.location.reload();
        formik.resetForm();
      } catch (error) {
        if (error.response.status === 400) {
          message.error("A image with the same URL already exists");
        } else {
          console.error('Error adding Ref. Image:', error);
          message.error("Error adding Ref. Image");
        }
      }
    },
  });

  return (
    <div>
      <Form layout="vertical">
        <Form.Item label="Image URL" required validateStatus={formik.errors.imageURL ? "error" : ""} help={formik.errors.imageURL}>
          <Input
            name="imageURL"
            value={formik.values.imageURL}
            onChange={formik.handleChange}
            onBlur={(event) => {
              formik.handleBlur(event);
              handleImageUrlBlur(event);
            }}
            placeholder='Enter Image URL'
          />
          {imageUrlPreview && (
            <div>
              <img 
                src={imageUrlPreview}
                alt="Preview of the image URL"
                style={{ width: "200px", marginTop: "10px" }}
              />
            </div>
          )}
        </Form.Item>
        <Form.Item label="Category" required validateStatus={formik.errors.category ? "error" : ""} help={formik.errors.category}>
          <Select
            name="category"
            value={formik.values.category || "Select"}
            onChange={(value) => formik.setFieldValue("category", value)}
            placeholder='Select Category'
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button key="submit" style={{ float: "right" }} type="primary" onClick={formik.handleSubmit}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRefImageModal;
