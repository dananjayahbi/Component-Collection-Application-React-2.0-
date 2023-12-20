import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import axios from 'axios';
import AddComponentCategoryModal from './AddComponentCategoryModal';
import EditComponentCategoryModal from './EditComponentCategoryModal'; // Import the EditComponentCategoryModal

const { confirm } = Modal;

const ComponentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false); // State for EditComponentCategoryModal
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State to store the selected category ID

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://cmsbe.codeloomstudios.live/Categories/getAllCategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = (categoryId) => {
    confirm({
      title: 'Do you want to delete this category?',
      onOk() {
        // Call the delete category API
        axios.delete(`https://cmsbe.codeloomstudios.live/Categories/deleteCategory/${categoryId}`)
          .then(() => {
            // Remove the deleted category from the state
            setCategories(categories.filter(category => category._id !== categoryId));
          })
          .catch(error => {
            console.error('Error deleting category:', error);
          });
      },
      onCancel() {
        // Do nothing on cancel
      },
    });
  };

  const columns = [
    {
      title: 'Component Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record._id)}>Edit</Button>
          <Button type="danger" onClick={() => handleDelete(record._id)}>Delete</Button>
        </span>
      ),
    },
  ];

  const handleEdit = (categoryId) => {
    // Set the selected category ID and open the EditComponentCategoryModal
    setSelectedCategoryId(categoryId);
    setEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    // Close the EditComponentCategoryModal
    setEditModalVisible(false);
  };

  const handleEditModalSuccess = () => {
    // Close the EditComponentCategoryModal
    setEditModalVisible(false);
  };

  const handleAdd = () => {
    // Open the AddComponentCategoryModal
    setAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    // Close the AddComponentCategoryModal
    setAddModalVisible(false);
  };

  const handleAddModalSuccess = (newCategory) => {
    // Handle success after adding a new category (optional)
    // You can update the state or perform any other action
    console.log('Category added successfully:', newCategory);

    // Close the AddComponentCategoryModal
    setAddModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Component Category
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="_id" />

      {/* AddComponentCategoryModal */}
      <AddComponentCategoryModal
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onSuccess={handleAddModalSuccess}
      />

      {/* EditComponentCategoryModal */}
      <EditComponentCategoryModal
        visible={isEditModalVisible}
        categoryId={selectedCategoryId}
        onCancel={handleEditModalCancel}
        onSuccess={handleEditModalSuccess}
      />
    </div>
  );
};

export default ComponentCategories;
