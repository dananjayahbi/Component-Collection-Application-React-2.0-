import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Modal, Row, Col, Card } from 'antd';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const RefImages = () => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [visibleAddModal, setVisibleAddModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/refImageCategories/getAllRefImageCategories');
        setCategories(response.data.map(category => category.categoryName));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/refImages/getAllRefImages', {
          params: {
            searchText,
            category,
          }
        });
        setImages(response.data.map(image => image.imageURL));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [searchText, category]);

  const handleSearch = value => {
    setSearchText(value);
  };

  const handleCategoryChange = value => {
    setCategory(value);
  };

  const handleAddModal = () => {
    setVisibleAddModal(true);
    // Code to open the "Add" modal
  };

  const handleEditImage = imageId => {
    // Code to open external Edit modal for the selected imageId
  };

  const handleDeleteImage = imageId => {
    // Code to delete the selected imageId
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Search placeholder="Search Ref. Images" onSearch={handleSearch} enterButton />
        </Col>
        <Col span={8}>
          <Select placeholder="Select Category" onChange={handleCategoryChange}>
            {categories.map(cat => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Button type="primary" onClick={handleAddModal}>
            Add
          </Button>
        </Col>
      </Row>
      <Row gutter={16}>
        {images.map(image => (
          <Col key={image.id} span={6}>
            <Card
              hoverable
              style={{ marginBottom: '20px' }}
              cover={<img alt="Ref. Image" src={image.url} />}
              actions={[
                <Button key="edit" onClick={() => handleEditImage(image.id)}>
                  Edit
                </Button>,
                <Button key="delete" onClick={() => handleDeleteImage(image.id)}>
                  Delete
                </Button>,
              ]}
            >
              {/* Add any additional content */}
            </Card>
          </Col>
        ))}
      </Row>
      {/* Add external Modals */}
      <Modal
        title="Add Image"
        visible={visibleAddModal}
        onCancel={() => setVisibleAddModal(false)}
        footer={null}
      >
        {/* Add content for the "Add" modal */}
      </Modal>
      {/* Add external Edit modal */}
    </div>
  );
};

export default RefImages;
