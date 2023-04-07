import "./UserModal.css";

import { Divider, Form, Input, Modal } from 'antd';

import axios from "axios";
import { useState } from 'react';

const UserModal = ({ user, open, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const updatedUser = { ...user, ...values };
      await axios.put(`http://localhost:3001/update/user/${user._id}`, updatedUser);
      onOk(updatedUser);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  

  return (
    <Modal
      title="Basic Modal"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      className="modal"
      xs={24}
      sm={8}
    >
    <Divider />
  
      <Form form={form} initialValues={user} labelCol={{ span: 8 }}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: 'email', required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ type: 'phone' ,required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="website" label="Website" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
      
    </Modal>
  );
};

export default UserModal;
