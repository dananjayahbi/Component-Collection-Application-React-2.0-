import React from "react";
import { useFormik } from "formik";
import {
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Divider,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { message, Input  } from 'antd';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MonacoEditor from "react-monaco-editor";

const { TextArea } = Input;

const EditLearningNodeModal = ({ node }) => {
  const formik = useFormik({
    initialValues: {
      title: node.title || "",
      sections: node.sections || [],
    },
    onSubmit: async (values) => {
      try {
        console.log(values)
        const response = await axios.put(
          `https://cmsbe.codeloomstudios.live/learningNodes/updateLearningNode/${node._id}`,
          values
        );

        if (response.status === 200) {
          message.success("Learning Node updated successfully");
          window.location.reload();
        } else {
          console.error("Error updating Learning Node");
        }
      } catch (error) {
        console.error("Error updating Learning Node:", error);
        message.error("Error updating Learning Node");
      }
    },
  });

  const handleAddSection = () => {
    formik.setFieldValue("sections", [
      ...formik.values.sections,
      {
        title: "",
        note: "",
        imageURLs: [{ imgURL: "" }],
        codes: [],
      },
    ]);
  };

  const handleRemoveSection = (sectionIndex) => {
    const updatedSections = formik.values.sections.filter(
      (_, index) => index !== sectionIndex
    );
    formik.setFieldValue("sections", updatedSections);
  };

  const handleAddImageURL = (sectionIndex) => {
    formik.setFieldValue(`sections[${sectionIndex}].imageURLs`, [
      ...formik.values.sections[sectionIndex].imageURLs,
      { imgURL: "" },
    ]);
  };

  const handleRemoveImageURL = (sectionIndex, imageURLIndex) => {
    const updatedImageURLs = formik.values.sections[
      sectionIndex
    ].imageURLs.filter((_, index) => index !== imageURLIndex);
    formik.setFieldValue(
      `sections[${sectionIndex}].imageURLs`,
      updatedImageURLs
    );
  };

  const handleAddCode = (sectionIndex) => {
    formik.setFieldValue(`sections[${sectionIndex}].codes`, [
      ...formik.values.sections[sectionIndex].codes,
      { language: "", title: "", code: "", notes: "" },
    ]);
  };

  const handleRemoveCode = (sectionIndex, codeIndex) => {
    const updatedCodes = formik.values.sections[sectionIndex].codes.filter(
      (_, index) => index !== codeIndex
    );
    formik.setFieldValue(`sections[${sectionIndex}].codes`, updatedCodes);
  };

  const handleCodeFieldChange = (value, sectionIndex, codeIndex) => {
    formik.setFieldValue(
      `sections[${sectionIndex}].codes[${codeIndex}].code`,
      value
    );
  };

  // Use useEffect to reset the formik state when the modal is closed or a new node is selected
  React.useEffect(() => {
    formik.resetForm({
      values: {
        title: node.title || "",
        sections: node.sections || [],
      },
    });
  }, [node]);

  return (
    <>
      <Typography variant="h5" style={{ marginBottom: "20px" }}>
        Edit Learning Node
      </Typography>
      <Divider style={{ marginBottom: "20px" }} />
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              required
              value={formik.values.title}
              onChange={formik.handleChange}
            />
          </Grid>
          {formik.values.sections.map((section, sectionIndex) => (
            <Grid
              container
              item
              spacing={2}
              key={sectionIndex}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                borderRadius: "10px",
                marginTop: "20px",
                marginLeft: "18px",
                padding: "20px",
              }}
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id={`sections[${sectionIndex}].title`}
                  name={`sections[${sectionIndex}].title`}
                  label="Section Title"
                  value={section.title}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextArea
                  fullWidth
                  rows={5}
                  id={`sections[${sectionIndex}].note`}
                  name={`sections[${sectionIndex}].note`}
                  label="Section Note"
                  value={section.note}
                  style={{fontSize: "16px"}}
                  onChange={formik.handleChange}
                />
              </Grid>
              {section.imageURLs.map((imageURL, imageURLIndex) => (
                <Grid container item spacing={2} key={imageURLIndex}>
                  <Grid item xs={10}>
                    <TextField
                      fullWidth
                      id={`sections[${sectionIndex}].imageURLs[${imageURLIndex}].imgURL`}
                      name={`sections[${sectionIndex}].imageURLs[${imageURLIndex}].imgURL`}
                      label="Image URL"
                      value={imageURL.imgURL}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() =>
                        handleRemoveImageURL(sectionIndex, imageURLIndex)
                      }
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                  {imageURL.imgURL && (
                    <>
                      <br />
                      <img
                        src={imageURL.imgURL}
                        alt="&nbsp;Invalid URL"
                        style={{
                          marginTop: "5px",
                          marginLeft: "15px",
                          height: "auto",
                          width: "auto",
                          maxWidth: "500px",
                        }}
                      />
                    </>
                  )}
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddImageURL(sectionIndex)}
                >
                  Add Image URL
                </Button>
              </Grid>
              {section.codes.map((code, codeIndex) => (
                <Grid
                  container
                  item
                  spacing={2}
                  key={codeIndex}
                  style={{
                    backgroundColor: "#bbbbc5",
                    padding: "10px 15px 10px 0",
                    borderRadius: "5px",
                    marginTop: "10px",
                    marginLeft: "0px",
                  }}
                >
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Code Language"
                      labelId={`sections[${sectionIndex}].codes[${codeIndex}].language`}
                      id={`sections[${sectionIndex}].codes[${codeIndex}].language`}
                      name={`sections[${sectionIndex}].codes[${codeIndex}].language`}
                      value={code.language}
                      onChange={formik.handleChange}
                      fullWidth
                    >
                      <MenuItem value="HTML">HTML</MenuItem>
                      <MenuItem value="CSS">CSS</MenuItem>
                      <MenuItem value="JavaScript">JavaScript</MenuItem>
                      <MenuItem value="PHP">PHP</MenuItem>
                      <MenuItem value="MySQL">MySQL</MenuItem>
                      <MenuItem value="React">React</MenuItem>
                      <MenuItem value="NodeJS">NodeJS</MenuItem>
                      <MenuItem value="TypeScript">TypeScript</MenuItem>
                      <MenuItem value="JSON">JSON</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      id={`sections[${sectionIndex}].codes[${codeIndex}].title`}
                      name={`sections[${sectionIndex}].codes[${codeIndex}].title`}
                      label="Code Title"
                      value={code.title}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MonacoEditor
                      height="500"
                      id={`sections[${sectionIndex}].codes[${codeIndex}].code`}
                      name={`sections[${sectionIndex}].codes[${codeIndex}].code`}
                      language="javascript"
                      theme="vs-dark"
                      value={code.code}
                      options={{
                        selectOnLineNumbers: true,
                        automaticLayout: true,
                        padding: { top: 20, bottom: 20 },
                      }}
                      onChange={(value) =>
                        handleCodeFieldChange(value, sectionIndex, codeIndex)
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextArea
                      fullWidth
                      rows={5}
                      id={`sections[${sectionIndex}].codes[${codeIndex}].notes`}
                      name={`sections[${sectionIndex}].codes[${codeIndex}].notes`}
                      label="Code Notes"
                      value={code.notes}
                      style={{backgroundColor:"transparent"}}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} container justifyContent="flex-end">
                    <IconButton
                      onClick={() => handleRemoveCode(sectionIndex, codeIndex)}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddCode(sectionIndex)}
                >
                  Add Code
                </Button>
              </Grid>
              <Grid item xs={12} container justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RemoveIcon />}
                  onClick={() => handleRemoveSection(sectionIndex)}
                >
                  Remove Section
                </Button>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSection}
            >
              Add Section
            </Button>
          </Grid>
          <Grid item xs={12} container justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Learning Node
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditLearningNodeModal;
