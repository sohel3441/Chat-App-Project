import React, { useState } from 'react';
import API from '../services/api';
import EditChatModal from './EditChatModal';
import { toast } from 'react-toastify';
import './ChatList.css';

const ChatList = ({ chats, setActiveChat, refreshChats, activeChat }) => {
  const [editChat, setEditChat] = useState(null);

  const handleDelete = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      await API.delete(`/chats/${chatId}`);
      toast.success('Chat deleted');
      refreshChats();

      if (activeChat?._id === chatId) {
        setActiveChat(null);
      }
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`chat-list-item ${activeChat?._id === chat._id ? 'active' : ''}`}
        >
          <div onClick={() => setActiveChat(chat)}>
            {chat.user.firstName} {chat.user.lastName}
          </div>

          <div className="chat-actions">
            <button onClick={() => setEditChat(chat)} title="Edit">✏️</button>
            <button onClick={() => handleDelete(chat._id)} title="Delete">🗑️</button>
          </div>
        </div>
      ))}

      {editChat && (
        <EditChatModal
          chat={editChat}
          onClose={() => setEditChat(null)}
          onSuccess={() => {
            refreshChats();
            setEditChat(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatList;
