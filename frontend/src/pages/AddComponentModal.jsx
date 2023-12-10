// AddComponentModal.jsx

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Typography,
  Divider,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import MonacoEditor from "react-monaco-editor";

const { Option } = Select;
const { Title } = Typography;

const AddComponentModal = () => {
  const [categories, setCategories] = useState([]);
  const [imageUrlPreview, setImageUrlPreview] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/Categories/getAllCategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const initialValues = {
    componentName: "",
    category: "",
    mainTechnology: "",
    imageURL: "",
    description: "",
    notes: "",
    codes: [],
  };

  const validationSchema = Yup.object().shape({
    componentName: Yup.string().required("Component Name is required"),
    category: Yup.string().required("Category is required"),
    mainTechnology: Yup.string().required("Main Technology is required"),
    codes: Yup.array().of(
      Yup.object().shape({
        language: Yup.string().required("Language is required"),
        code: Yup.string().required("Code is required"),
        notes: Yup.string(),
      })
    ),
  });

  const handleImageUrlBlur = (event) => {
    const imageUrl = event.target.value;
    setImageUrlPreview(imageUrl);
  };

  const onSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/Components/addComponent", values);
      message.success("Component added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding component:", error);
      message.error("Error adding component");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const addCodeField = () => {
    formik.setFieldValue("codes", [
      ...formik.values.codes,
      { language: "", code: "", notes: "" },
    ]);
  };

  const removeCodeField = (index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes.splice(index, 1);
    formik.setFieldValue("codes", updatedCodes);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ float: "left" }}>
        Add Component
      </Title>
      <Divider style={{ backgroundColor: "#abaead" }} />
      <Form initialValues={initialValues} onFinish={formik.handleSubmit}>
        <Form.Item label="Component Name" name="componentName">
          <Input {...formik.getFieldProps("componentName")} />
          {formik.touched.componentName && formik.errors.componentName && (
            <div style={{ color: "red" }}>{formik.errors.componentName}</div>
          )}
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select
            placeholder="Select Category"
            onChange={(value) => formik.setFieldValue("category", value)}
            onBlur={() => formik.setFieldTouched("category", true)}
          >
            {categories.map((category) => (
              <Option key={category._id} value={category.categoryName}>
                {category.name}
              </Option>
            ))}
          </Select>
          {formik.touched.category && formik.errors.category && (
            <div style={{ color: "red" }}>{formik.errors.category}</div>
          )}
        </Form.Item>

        <Form.Item label="Main Technology" name="mainTechnology">
          <Select
            placeholder="Select Main Technology"
            onChange={(value) => formik.setFieldValue("mainTechnology", value)}
            onBlur={() => formik.setFieldTouched("mainTechnology", true)}
          >
            <Option value="HTML/CSS/JS">HTML/CSS/JS</Option>
            <Option value="MERN">MERN</Option>
            <Option value="MEAN">MEAN</Option>
          </Select>
          {formik.touched.mainTechnology && formik.errors.mainTechnology && (
            <div style={{ color: "red" }}>{formik.errors.mainTechnology}</div>
          )}
        </Form.Item>

        <Form.Item label="Image URL" name="imageURL">
          <Input
            {...formik.getFieldProps("imageURL")}
            onBlur={(event) => {
              formik.handleBlur(event);
              handleImageUrlBlur(event);
            }}
          />
          {imageUrlPreview && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={imageUrlPreview}
                alt="Image Preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea {...formik.getFieldProps("description")} />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={10} {...formik.getFieldProps("notes")} />
        </Form.Item>

        {formik.values.codes.map((code, index) => (
          <Space
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // Align items vertically and justify content
              width: "100%",
              borderBottom: "1px solid #abaead",
              marginBottom: "20px",
            }}
            align="baseline"
          >
            <Title level={3} style={{ marginTop: "50px", lineHeight: "0.3" }}>
              Code Field {index + 1}
            </Title>
            <Divider style={{ backgroundColor: "#abaead" }} />

            <Form.Item label="Language" name={`codes[${index}].language`}>
              <Select
                placeholder="Select Language"
                onChange={(value) =>
                  formik.setFieldValue(`codes[${index}].language`, value)
                }
                onBlur={() =>
                  formik.setFieldTouched(`codes[${index}].language`, true)
                }
              >
                <Option value="HTML">HTML</Option>
                <Option value="CSS">CSS</Option>
                <Option value="JavaScript">JavaScript</Option>
                <Option value="PHP">PHP</Option>
                <Option value="MySQL">MySQL</Option>
                <Option value="React">React</Option>
                <Option value="NodeJs">NodeJs</Option>
                <Option value="Angular">Angular</Option>
                <Option value="NextJS">NextJS</Option>
                <Option value="Python">Python</Option>
              </Select>
              {formik.touched.codes?.[index]?.language &&
                formik.errors.codes?.[index]?.language && (
                  <div style={{ color: "red" }}>
                    {formik.errors.codes[index].language}
                  </div>
                )}
            </Form.Item>

            <Form.Item label="Code" name={`codes[${index}].code`}>
              <MonacoEditor
                height="800"
                width="66vw"
                language={formik.values.codes[index].language.toLowerCase()}
                value={formik.values.codes[index].code}
                onChange={(value) =>
                  formik.setFieldValue(`codes[${index}].code`, value)
                }
                theme={"vs-dark"}
                options={{
                  fontSize: 14,
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                }}
              />
            </Form.Item>

            <Form.Item label="Notes" name={`codes[${index}].notes`}>
              <Input.TextArea
                rows={5}
                style={{ width: "50vw" }}
                {...formik.getFieldProps(`codes[${index}].notes`)}
              />
            </Form.Item>

            <Button
              type="danger"
              onClick={() => removeCodeField(index)}
              style={{ width: "125px", color:"#fff", marginBottom:"10px", backgroundColor: "#ff4d4f", float:"right" }}
            >
              Remove Field
            </Button>
          </Space>
        ))}

        <Button
          type="primary"
          onClick={addCodeField}
          style={{ width: "125px", backgroundColor: "#31e567" }}
        >
          Add Code Field
        </Button>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            style={{ float: "right" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddComponentModal;
