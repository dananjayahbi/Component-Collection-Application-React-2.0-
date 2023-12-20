import React, { useState, useEffect } from "react";
import { Select, Button, Modal, Image, Row, Col, Card, Pagination, Input } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import axios from "axios";
import AddRefImageModal from "./AddRefImageModal";
import EditRefImageModal from "./EditRefImageModal";

const { Option } = Select;
const { confirm } = Modal;

const RefImages = () => {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(10);
  const [manualImagesPerPage, setManualImagesPerPage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://cmsbe.codeloomstudios.live/refImageCategories/getAllRefImageCategories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://cmsbe.codeloomstudios.live/refImages/getAllRefImages"
        );
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchImages();
  }, []);

  const showDeleteConfirm = (recordID) => {
    confirm({
      title: 'Are you sure you want to delete this Ref. Image?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      maskClosable: true,
      cancelText: 'No',
      onOk() {
        handleDelete(recordID);
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };

  const handleDelete = async (recordID) => {
    try {
      await axios.delete(`https://cmsbe.codeloomstudios.live/refImages/deleteRefImage/${recordID}`);
      setImages((prevImages) => prevImages.filter((image) => image._id !== recordID));
    } catch (error) {
      console.error('Error deleting Ref. Image:', error);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleAddImage = () => {
    setIsAddModalVisible(true);
  };

  const handleEditImage = (image) => {
    setEditImage(image);
    setIsEditModalVisible(true);
  };

  const handleManualImagesPerPageChange = (e) => {
    const value = e.target.value;
    setManualImagesPerPage(value);
  };

  const applyManualImagesPerPage = () => {
    const parsedValue = parseInt(manualImagesPerPage, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setImagesPerPage(parsedValue);
      setCurrentPage(1);
    }
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images
    .filter((image) => !selectedCategory || image.category === selectedCategory)
    .slice(indexOfFirstImage, indexOfLastImage);

  return (
    <div>
      <Row style={{ width: "100%" }}>
        <Col span={12}>
          <Select
            placeholder="Select a category"
            style={{ width: 400 }}
            onChange={(value) => handleCategoryChange(value)}
            defaultValue={"All Images"}
          >
            <Option value="">All Images</Option>
            {categories.map((category) => (
              <Option key={category._id} value={category.categoryName}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Row justify="end">
            <Col>
              <Input
                placeholder="Images per Page"
                value={manualImagesPerPage}
                onChange={handleManualImagesPerPageChange}
                style={{ width: 150, marginRight: 10 }}
              />
              <Button type="primary" onClick={applyManualImagesPerPage}>
                Apply
              </Button>
            </Col>
            <Button type="primary" style={{ marginLeft: "10px", marginBottom: "20px" }} onClick={handleAddImage}>
              Add Image
            </Button>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Card style={{ width: "80vw" }}>
            {currentImages.length > 0 ? (
              currentImages.map((image) => (
                <Card.Grid
                  key={image._id}
                  style={{ width: "24%", textAlign: "center", marginRight: "5px", marginBottom: "5px" }}
                >
                  <Image
                    src={image.imageURL}
                    alt={image.imageName}
                    style={{ width: "100%" }}
                  />
                  <p>{image.imageName}</p>
                  <Button
                    type="primary"
                    ghost
                    icon={<EditOutlined />}
                    style={{ marginRight: "10px" }}
                    onClick={() => handleEditImage(image)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(image._id)}
                  >
                    Delete
                  </Button>
                </Card.Grid>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <EyeOutlined style={{ fontSize: "36px", color: "#ccc" }} />
                <p>No images to display</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            current={currentPage}
            pageSize={imagesPerPage}
            total={images.length}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: "20px" }}
          />
        </Col>
      </Row>
      <Modal
        title="Add RefImage"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose={true}
      >
        <AddRefImageModal />
      </Modal>

      {editImage && (
        <Modal
          title="Edit RefImage"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
          width={800}
          destroyOnClose={true}
        >
          <EditRefImageModal
            image={editImage}
          />
        </Modal>
      )}
    </div>
  );
};

export default RefImages;
