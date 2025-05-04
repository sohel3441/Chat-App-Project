import React, { useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import './NewChatModal.css'; // Reuse styles

const EditChatModal = ({ chat, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    firstName: chat.user.firstName,
    lastName: chat.user.lastName,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.put(`/chats/${chat._id}`, form);
      toast.success('Chat updated');
      onSuccess();
    } catch (err) {
      toast.error('Failed to update chat');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Chat</h3>
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />
        <div className="modal-actions">
          <button onClick={handleSubmit}>Update</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditChatModal;
