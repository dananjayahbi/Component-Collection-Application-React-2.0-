import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import axios from 'axios';
import AddLearningNodeModal from './AddLearningNodeModal';
import EditLearningNodeModal from './EditLearningNodeModal';
import ViewLearningNodeModal from './ViewLearningNodeModal';  // Add the appropriate path for the ViewLearningNodeModal

const { confirm } = Modal;

const LearningNodes = () => {
  const [learningNodes, setLearningNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLNAddModalVisible, setLNAddModalVisible] = useState(false);
  const [isLNEditModalVisible, setLNEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    // Fetch learning nodes from the server
    const fetchLearningNodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/learningNodes/getAllLearningNode');
        setLearningNodes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching learning nodes:', error);
      }
    };

    fetchLearningNodes();
  }, []);

  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Are you sure you want to delete this learning node?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log('Deletion canceled');
      },
    });
  };

  const handleEdit = (record) => {
    // Implement opening the EditLearningNode Modal
    // You can use state to manage the modal visibility and pass the selected learning node to the modal
    setSelectedNode(record);
    setLNEditModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      // Delete learning node
      await axios.delete(`http://localhost:5000/learningNodes/deleteLearningNode/${record._id}`);
      // Update the learning nodes after deletion
      setLearningNodes((prevNodes) => prevNodes.filter((node) => node._id !== record._id));
    } catch (error) {
      console.error('Error deleting learning node:', error);
    }
  };

  const handleView = (record) => {
    // Implement opening the ViewLearningNode Modal
    // You can use state to manage the modal visibility and pass the selected learning node to the modal
    setSelectedNode(record);
    setViewModalVisible(true);
  };

  const handleAdd = () => {
    // Open the AddLearningNodeModal as a modal
    setLNAddModalVisible(true);
  };

  const handleAddLNModalSuccess = () => {
    // Close the AddLearningNodeModal
    setLNAddModalVisible(false);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" style={{ marginBottom: '20px' }} onClick={handleAdd}>
        Add Learning Node
      </Button>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {learningNodes.map((node) => (
          <Card
            key={node._id}
            style={{
              width: 'calc(33.33% - 16px)',
              marginBottom: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div>
              <Typography style={{ marginBottom: '12px', fontWeight:"600" }}>{node.title}</Typography>
            </div>
            <div style={{ marginBottom: '12px', display:"flex",justifyContent:"center", alignItems:"center" }}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(node)}
                style={{ marginRight: '8px' }}
              >
                Edit
              </Button>
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(node)}
              >
                Delete
              </Button>
            </div>
            {/* Additional card content here */}
            <div style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
              <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(node)}>
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* AddLearningNodeModal goes here */}
      <Modal
        visible={isLNAddModalVisible}
        onCancel={() => setLNAddModalVisible(false)}
        footer={null}
        width={"100vw"}
        style={{top:20}}
        destroyOnClose={true}
        maskClosable={false}
      >
        <AddLearningNodeModal onSuccess={handleAddLNModalSuccess} />
      </Modal>

      {/* EditLearningNodeModal goes here */}
      <Modal
        visible={isLNEditModalVisible}
        onCancel={() => setLNEditModalVisible(false)}
        footer={null}
        width={"100vw"}
        style={{top:20}}
        destroyOnClose={true}
        maskClosable={false}
      >
        <EditLearningNodeModal node={selectedNode} />
      </Modal>

      {/* ViewLearningNodeModal goes here */}
      <Modal
        title="View Learning Node"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        <ViewLearningNodeModal node={selectedNode} />
      </Modal>
    </div>
  );
};

export default LearningNodes;
