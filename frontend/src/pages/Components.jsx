import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import SearchIcon from "@mui/icons-material/Search";
import { Modal, message } from "antd";
import { CloseOutlined } from "@mui/icons-material";

// Import the new modal components
import AddComponent from "./AddComponentModal";
import EditComponentModal from "./EditComponentModal";
import axios from "axios";

export default function Components() {
  const [categories, setCategories] = useState([]);
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [mainTechnologies, setMainTechnologies] = useState([
    "HTML,CSS,JS,PHP,MYSQL",
    "MERN",
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch categories from the API
    fetch("https://cmsbe.codeloomstudios.live/Categories/getAllCategories")
      .then((response) => response.json())
      .then((data) => setCategories(data));

    // Fetch components from the API
    fetch("https://cmsbe.codeloomstudios.live/Components/getAllComponents")
      .then((response) => response.json())
      .then((data) => {
        setComponents(data);
        setFilteredComponents(shuffleArray(data).slice(0, 10));
      });
  }, []);

  const handleSubmit = (values) => {
    // Filter components by category and mainTechnology
    const filtered = components.filter(
      (component) =>
        (values.category === "" || component.category === values.category) &&
        (values.mainTechnology === "" ||
          component.mainTechnology === values.mainTechnology)
    );

    setFilteredComponents(filtered);
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // Filter components by searchTerm
    const filtered = components.filter((component) =>
      component.componentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredComponents(filtered);
  };

  const openAddModal = () => {
    Modal.info({
      content: (
        <>
          <Button
            style={{ position: "absolute", top: 0, right: 0 }}
            onClick={() => Modal.destroyAll()}
          >
            <CloseOutlined />
          </Button>
          <AddComponent />
        </>
      ),
      maskClosable: true,
      width: "80vw", // Increase the width of the modal
      mask: "true", // Disable the modal background
      style: { top: 20 }, // Adjust the modal position
      okButtonProps: { style: { display: "none" } }, // Hide the OK button
    });
  };

  const openEditModal = (FetchedComponent) => {
    Modal.info({
      content: <EditComponentModal FetchedComponent={FetchedComponent} />,
      maskClosable: true,
      width: "80vw", // Increase the width of the modal
      mask: "true", // Disable the modal background
      style: { top: 20 }, // Adjust the modal position
      okButtonProps: { style: { display: "none" } }, // Hide the OK button
    });
  };

  const openDeleteModal = (componentId) => {
    Modal.confirm({
      title: "Delete Component",
      content: "Are you sure you want to delete this component?",
      onOk() {
        //Make a DELETE request to the API
        axios
          .delete(`https://cmsbe.codeloomstudios.live/Components/deleteComponent/${componentId}`)
          .then((response) => {
            console.log("Component deleted successfully");
            message.success("Component deleted successfully");
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error deleting component:", error);
            message.error("Error deleting component");
          });
      },
      onCancel() {
        console.log("Cancel delete");
      },
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h5">Browse Components</Typography>
      <Divider sx={{ mt: 2, mb: 2.5 }} />

      <Box>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "20px", float: "right", width: "160px" }}
          onClick={openAddModal}
        >
          Add Component
        </Button>
      </Box>

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Search by componentName"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Formik
        initialValues={{ category: "", mainTechnology: "" }}
        onSubmit={handleSubmit}
      >
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Grid container spacing={2} style={{ width: "500px" }}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="category-label">Select Category</InputLabel>
                <Field
                  as={Select}
                  labelId="category-label"
                  label="Select Category"
                  name="category"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem
                      key={category.categoryName}
                      value={category.categoryName}
                    >
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="main-technology-label">
                  Select Main Technology
                </InputLabel>
                <Field
                  as={Select}
                  labelId="main-technology-label"
                  label="Select Main Technology"
                  name="mainTechnology"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {mainTechnologies.map((technology) => (
                    <MenuItem key={technology} value={technology}>
                      {technology}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Find
              </Button>
            </Grid>
          </Grid>
        </Form>
      </Formik>

      <Grid container spacing={2}>
        {filteredComponents.map((component) => (
          <Grid item key={component.id} xs={12} sm={6}>
            <Card sx={{ maxWidth: 645 }}>
              <CardMedia
                component="img"
                height="140"
                image={component.imageURL}
                alt={component.componentName}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {component.componentName}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => openEditModal(component)}
                >
                  View or Update
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => openDeleteModal(component._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* If no results found */}
      {filteredComponents.length === 0 ? (
        <Grid container spacing={2} style={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "100px",
            }}
          >
            <img
              src="https://img.freepik.com/free-vector/business-background-design_1343-21.jpg?w=740&t=st=1700673907~exp=1700674507~hmac=50bc49b08b1f5f674ecdfd0dbd7a2955a62ffab94a720de8c9e9500e81b941af"
              alt="No Results Found"
              style={{ width: "300px", height: "300px", borderRadius: "50%" }}
            />
            <Typography variant="h6" style={{ marginTop: "10px" }}>
              No results found.
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </Box>
  );
}
