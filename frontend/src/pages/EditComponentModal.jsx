import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import { message } from "antd";
import { useFormik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MonacoEditor from "react-monaco-editor";
import { Select, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function EditComponentModal({ FetchedComponent }) {
  const [categories, setCategories] = useState([]);
  const [IMGURL, setIMGURL] = useState("");

  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        //console.log(componentData);
        formik.setValues({
          componentName: FetchedComponent.componentName || "",
          category: FetchedComponent.category || "",
          mainTechnology: FetchedComponent.mainTechnology || "",
          imageURL: FetchedComponent.imageURL || "",
          description: FetchedComponent.description || "",
          notes: FetchedComponent.notes || "",
          codes: FetchedComponent.codes || [
            { language: "", code: "", notes: "" },
          ],
        });
      } catch (error) {
        console.error("Error fetching component data:", error);
      }
    };

    fetchComponentData();
  }, [FetchedComponent]);

  const handleChange = (event) => {
    formik.handleChange(event);
  };

  const handleBlur = (event) => {
    formik.handleBlur(event);
  };

  const handleCodeFieldChange = (value, index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes[index].code = value;

    formik.handleChange({
      target: {
        name: `codes[${index}].code`,
        value: updatedCodes[index].code,
      },
    });
  };

  const formik = useFormik({
    initialValues: FetchedComponent
      ? {
          componentName: FetchedComponent.componentName || "",
          category: FetchedComponent.category || "",
          mainTechnology: FetchedComponent.mainTechnology || "",
          imageURL: FetchedComponent.imageURL || "",
          description: FetchedComponent.description || "",
          notes: FetchedComponent.notes || "",
          codes: FetchedComponent.codes || [
            { language: "", code: "", notes: "" },
          ],
        }
      : {
          componentName: "",
          category: "",
          mainTechnology: "",
          imageURL: "",
          description: "",
          notes: "",
          codes: [{ language: "", code: "", notes: "" }],
        },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `https://cmsbe.codeloomstudios.live/Components/updateComponent/${FetchedComponent._id}`,
          values
        );

        if (response.status === 200) {
          message.success("Component added successfully");
          window.location.reload();
        } else {
          message.success("Component added successfully");
        }
      } catch (error) {
        console.error("Error updating component:", error);
      }
    },
  });

  const addCodeField = () => {
    formik.setValues({
      ...formik.values,
      codes: [...formik.values.codes, { language: "", code: "" }],
    });
  };

  const removeCodeField = (index) => {
    const updatedCodes = [...formik.values.codes];
    updatedCodes.splice(index, 1);
    formik.setValues({
      ...formik.values,
      codes: updatedCodes,
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://cmsbe.codeloomstudios.live/Categories/getAllCategories"
        );

        if (response.status === 200) {
          setCategories(response.data.map((category) => category.categoryName));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box p={1}>
      <form onSubmit={formik.handleSubmit}>
        <Box>
          <Typography variant="h5">View or Update Component</Typography>
          <Divider sx={{ mt: 2, mb: 2.5 }} />
        </Box>

        {/* Your Formik form fields */}
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Component Name
          </Typography>
          <Input
            placeholder="Component Name"
            name="componentName"
            value={formik.values.componentName}
            onChange={(event) =>
              formik.setFieldValue("componentName", event.target.value)
            }
          />
        </Box>

        {/* Category Dropdown */}
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Component Category
          </Typography>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a category"
            name="category"
            value={formik.values.category}
            onChange={(value) => formik.setFieldValue("category", value)}
          >
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </Box>

        {/* Main Technology Dropdown */}
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Main Technology
          </Typography>
          <Select
            style={{ width: "100%" }}
            placeholder="Select a main technology"
            name="mainTechnology"
            value={formik.values.mainTechnology}
            onChange={(value) => formik.setFieldValue("mainTechnology", value)}
          >
            <Select.Option value="MERN">MERN</Select.Option>
            <Select.Option value="HTML,CSS,JS,PHP,MYSQL">
              HTML,CSS,JS,PHP,MYSQL
            </Select.Option>
          </Select>
        </Box>

        {/* Image URL Input */}
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Image URL
          </Typography>
          <Input
            placeholder="Image URL"
            name="imageURL"
            value={formik.values.imageURL}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Box>

        {/* Display Image Box */}
        {formik.values.imageURL && (
          <Box>
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Image Preview
            </Typography>
            <img
              src={formik.values.imageURL}
              alt="&nbsp;&nbsp;invalid URL"
              style={{ maxWidth: "100%" }}
            />
          </Box>
        )}

        {/* Description TextArea */}
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Description
          </Typography>
          <Input.TextArea
            placeholder="Description"
            name="description"
            value={formik.values.description}
            onChange={(event) =>
              formik.setFieldValue("description", event.target.value)
            }
            autoSize={{ minRows: 6 }}
          />
        </Box>

        {/* Notes TextArea */}
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Notes
          </Typography>
          <Input.TextArea
            placeholder="Notes"
            name="notes"
            value={formik.values.notes}
            onChange={(event) =>
              formik.setFieldValue("notes", event.target.value)
            }
            autoSize={{ minRows: 6 }}
          />
        </Box>

        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Code Inputs
        </Typography>
        <Divider sx={{ mt: 2, mb: 2.5 }} />

        {/* Codes Fields */}
        {formik.values.codes.map((codeField, index) => (
          <div
            key={index}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              padding: "20px",
              marginTop: "20px",
              marginBottom: "25px",
            }}
          >
            <Box>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Language
              </Typography>
              <Select
                placeholder="Language"
                name={`codes[${index}].language`}
                value={codeField.language}
                onChange={(value) =>
                  formik.setFieldValue(`codes[${index}].language`, value)
                }
                style={{ marginRight: "5px", width: "300px" }}
              >
                <Select.Option value="HTML">HTML</Select.Option>
                <Select.Option value="CSS">CSS</Select.Option>
                <Select.Option value="JavaScript">JavaScript</Select.Option>
                <Select.Option value="PHP">PHP</Select.Option>
                <Select.Option value="MySQL">MySQL</Select.Option>
                <Select.Option value="React">React</Select.Option>
                <Select.Option value="NodeJS">NodeJS</Select.Option>
                <Select.Option value="TypeScript">TypeScript</Select.Option>
                <Select.Option value="JSON">JSON</Select.Option>
              </Select>
            </Box>

            {/* Code Editor */}
            <Box>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Code :
              </Typography>
              <MonacoEditor
                height="1000"
                name={`codes[${index}].code`}
                language="javascript"
                theme="vs-dark"
                value={codeField.code}
                options={{
                  selectOnLineNumbers: true,
                  automaticLayout: true,
                  padding: { top: 20, bottom: 20 },
                }}
                onChange={(value) => handleCodeFieldChange(value, index)}
              />
            </Box>

            {/* Notes TextArea */}
            <Box>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Notes
              </Typography>
              <Input.TextArea
                placeholder="Notes"
                name={`codes[${index}].notes`}
                value={codeField.notes}
                onChange={(event) =>
                  formik.setFieldValue(
                    `codes[${index}].notes`,
                    event.target.value
                  )
                }
                autoSize={{ minRows: 7 }}
              />
            </Box>

            {/* Remove Code Field Button */}
            <Box sx={{display:"flex"}}>
                <IconButton
                type="button"
                onClick={() => removeCodeField(index)}
                size="small"
                color="error"
                style={{ width: "35px", marginLeft: "auto" }}
                >
                <DeleteIcon />
                </IconButton>
            </Box>
          </div>
          
        ))}

        {/* Add Code Field Button */}
        <Button
          type="button"
          onClick={addCodeField}
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          Add Code Field
        </Button>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </form>
    </Box>
  );
}
