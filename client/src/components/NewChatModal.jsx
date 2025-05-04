  import React, { useState } from 'react';
  import API from '../services/api';
  import { toast } from 'react-toastify';
  import './NewChatModal.css';

  const NewChatModal = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({ firstName: '', lastName: '' });

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
      if (!form.firstName || !form.lastName) {
        toast.error('Please enter both names');
        return;
      }

      try {
        await API.post('/chats', form);
        toast.success('Chat created');
        onSuccess();
      } catch (err) {
        toast.error('Failed to create chat');
      }
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Create New Chat</h3>
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
            <button onClick={handleSubmit}>Create</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  export default NewChatModal;
