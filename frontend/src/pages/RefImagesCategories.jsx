import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import axios from "axios";
import AddRefImageCategoryModal from "./AddRefImageCategoryModal";
import EditRefImageCategoryModal from "./EditRefImageCategoryModal"; // Import the EditRefImageCategoryModal

const { confirm } = Modal;

const RefImagesCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    // Fetch categories from the server
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

  const handleDelete = (categoryId) => {
    confirm({
      title: "Do you want to delete this category?",
      onOk() {
        // Call the delete category API
        axios
          .delete(
            `https://cmsbe.codeloomstudios.live/refImageCategories/deleteRefImageCategory/${categoryId}`
          )
          .then(() => {
            // Remove the deleted category from the state
            setCategories(
              categories.filter((category) => category._id !== categoryId)
            );
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
          });
      },
      onCancel() {
        // Do nothing on cancel
      },
    });
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEdit(record._id)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const handleEdit = (categoryId) => {
    // Set the selected category ID and open the EditRefImageCategoriesModal
    setSelectedCategoryId(categoryId);
    setEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    // Close the EditRefImageCategoriesModal
    setEditModalVisible(false);
  };

  const handleEditModalSuccess = () => {
    // Close the EditRefImageCategoriesModal
    setEditModalVisible(false);
  };

  const handleAdd = () => {
    // Open the AddRefImageCategoriesModal
    setAddModalVisible(true);
  };

  const handleAddModalCancel = () => {
    // Close the AddRefImageCategoriesModal
    setAddModalVisible(false);
  };

  const handleAddModalSuccess = (newCategory) => {
    // Handle success after adding a new category (optional)
    // You can update the state or perform any other action
    console.log("Category added successfully:", newCategory);

    // Close the AddRefImageCategoriesModal
    setAddModalVisible(false);
  };
  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Ref. Image Category
      </Button>
      <Table dataSource={categories} columns={columns} rowKey="_id" />

      {/* AddRefImageCategoryModal */}
      <AddRefImageCategoryModal
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        onSuccess={handleAddModalSuccess}
      />

      {/* EditRefImageCategoryModal */}
      <EditRefImageCategoryModal
        visible={isEditModalVisible}
        categoryId={selectedCategoryId}
        onCancel={handleEditModalCancel}
        onSuccess={handleEditModalSuccess}
      />
    </div>
  );
};

export default RefImagesCategories;
