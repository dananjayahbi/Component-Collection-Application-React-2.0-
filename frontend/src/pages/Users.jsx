import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, message } from 'antd';
import axios from 'axios';
import { useFormik } from 'formik';
import EditUserModal from './EditUserModal';
import { SearchOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [visibleAddUserModal, setVisibleAddUserModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [visibleDeleteConfirmModal, setVisibleDeleteConfirmModal] = useState(false);
  const [visibleEditUserModal, setVisibleEditUserModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button type="primary" style={{ padding: "0px 25px" }} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="default" danger onClick={() => showDeleteConfirm(record._id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users/getAllUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/deleteUser/${userId}`);
      getUsers();
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user');
    }
  };

  const showDeleteConfirm = (userId) => {
    setDeleteUserId(userId);
    setVisibleDeleteConfirmModal(true);
  };

  const handleDeleteCancel = () => {
    setVisibleDeleteConfirmModal(false);
    setDeleteUserId(null);
  };

  const handleDeleteOk = () => {
    handleDelete(deleteUserId);
    handleDeleteCancel();
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setVisibleEditUserModal(true);
  };

  const handleEditCancel = () => {
    setVisibleEditUserModal(false);
    setEditUserId(null);
  };

  useEffect(() => {
    // Update filtered projects when search text changes
    const filteredUsers = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
     );
    setFilteredUsers(filteredUsers);
  }, [searchText, users]);

  const addUserFormik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/users/register', {
          username: values.username,
          email: values.email,
          password: values.password,
        });
        message.success('User added successfully');
        getUsers();
        setVisibleAddUserModal(false);
      } catch (error) {
        console.error('Error adding user:', error);
        message.error('Error adding user');
      }
    },
  });

  const handleAddUser = () => {
    setVisibleAddUserModal(true);
  };

  const handleAddUserModalCancel = () => {
    setVisibleAddUserModal(false);
  };

  return (
    <div style={{marginLeft:"20px", marginRight:"10px"}}>
      <Input
        placeholder="Search users"
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" onClick={handleAddUser} style={{ marginBottom: 16, float:"right" }}>
        Add User
      </Button>
      <Table dataSource={filteredUsers} columns={columns} rowKey="_id" />

      {/* Add User Modal */}
      <Modal
        title="Add User"
        visible={visibleAddUserModal}
        onCancel={handleAddUserModalCancel}
        footer={null}
      >
        <Form onFinish={addUserFormik.handleSubmit}>
          <Form.Item label="Username" name="username">
            <Input {...addUserFormik.getFieldProps('username')} />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input {...addUserFormik.getFieldProps('email')} />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password {...addUserFormik.getFieldProps('password')} />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirmPassword">
            <Input.Password {...addUserFormik.getFieldProps('confirmPassword')} />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Add User
          </Button>
          <Button onClick={handleAddUserModalCancel}>Cancel</Button>
        </Form>
      </Modal>

      {/* Delete User Confirm Modal */}
      <Modal
        title="Confirm Delete"
        visible={visibleDeleteConfirmModal}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      {/* Edit User Modal */}
      <EditUserModal
        visible={visibleEditUserModal}
        onCancel={handleEditCancel}
        userId={editUserId}
        getUsers={getUsers}
      />
    </div>
  );
};

export default Users;
