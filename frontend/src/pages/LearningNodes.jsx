import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Typography, Input } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Formik } from 'formik';
import axios from 'axios';
import AddLearningNodeModal from './AddLearningNodeModal';
import EditLearningNodeModal from './EditLearningNodeModal';
import ViewLearningNodeModal from './ViewLearningNodeModal';  

const { confirm } = Modal;

const LearningNodes = () => {
  const [learningNodes, setLearningNodes] = useState([]);
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLNAddModalVisible, setLNAddModalVisible] = useState(false);
  const [isLNEditModalVisible, setLNEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLearningNodes = async () => {
      try {
        const response = await axios.get('https://cmsbe.codeloomstudios.live/learningNodes/getAllLearningNode');
        setLearningNodes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching learning nodes:', error);
      }
    };

    fetchLearningNodes();
  }, []);

  useEffect(() => {
    const filtered = learningNodes.filter(node =>
      node.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNodes(filtered);
  }, [searchTerm, learningNodes]);

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
    setSelectedNode(record);
    setLNEditModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      await axios.delete(`https://cmsbe.codeloomstudios.live/learningNodes/deleteLearningNode/${record._id}`);
      setLearningNodes((prevNodes) => prevNodes.filter((node) => node._id !== record._id));
    } catch (error) {
      console.error('Error deleting learning node:', error);
    }
  };

  const handleView = (record) => {
    setSelectedNode(record);
    setViewModalVisible(true);
  };

  const handleAdd = () => {
    setLNAddModalVisible(true);
  };

  const handleAddLNModalSuccess = () => {
    setLNAddModalVisible(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Input
        placeholder="Search by title"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', width: '300px' }}
      />
      <Button type="primary" style={{ marginBottom: '20px', marginLeft:"10px" }} onClick={handleAdd}>
        Add Learning Node
      </Button>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {(searchTerm ? filteredNodes : learningNodes).map((node) => (
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
              <Typography style={{ marginBottom: '12px', fontWeight: '600' }}>{node.title}</Typography>
            </div>
            <div style={{ marginBottom: '12px', display: "flex", justifyContent: "center", alignItems: "center" }}>
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

            {/* This button is hidden for now. Add this functionality later */}
            {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button type="default" icon={<EyeOutlined />} onClick={() => handleView(node)}>
                View
              </Button>
            </div> */}


          </Card>
        ))}
      </div>

      <Modal
        visible={isLNAddModalVisible}
        onCancel={() => setLNAddModalVisible(false)}
        footer={null}
        width={"100vw"}
        style={{ top: 20 }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <AddLearningNodeModal onSuccess={handleAddLNModalSuccess} />
      </Modal>

      <Modal
        visible={isLNEditModalVisible}
        onCancel={() => setLNEditModalVisible(false)}
        footer={null}
        width={"100vw"}
        style={{ top: 20 }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <EditLearningNodeModal node={selectedNode} />
      </Modal>

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
