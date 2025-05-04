import React, { useEffect, useState } from 'react';
import socket from '../sockets/socket';
import API from '../services/api';
import { toast } from 'react-toastify';
import './ChatBox.css';

const ChatBox = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!chat) return;
    socket.emit('joinChat', chat._id);
    setMessages(chat.messages);
  }, [chat]);

  useEffect(() => {
    socket.on('message', (msg) => {
      if (msg.chat === chat._id) {
        setMessages((prev) => [...prev, msg]);
      } else {
        toast.info(`New message in another chat!`);
      }
    });

    return () => socket.off('message');
  }, [chat]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await API.post('/messages', {
      chatId: chat._id,
      text,
    });

    socket.emit('sendMessage', { chatId: chat._id, text });
    setText('');
  };

  const handleEdit = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text);
  };

  const saveEdit = async (id) => {
    try {
      const { data } = await API.put(`/messages/${id}`, { text: editText });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, text: data.msg.text } : msg))
      );
      setEditingId(null);
      toast.success('Message updated');
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
          >
            {editingId === msg._id ? (
              <div className="edit-container">
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(msg._id)}>💾</button>
                <button onClick={() => setEditingId(null)}>❌</button>
              </div>
            ) : (
              <>
                <span>{msg.text}</span>
                {msg.sender === 'user' && (
                  <button className="edit-btn" onClick={() => handleEdit(msg)}>✏️</button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
