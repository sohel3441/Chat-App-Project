import React, { useEffect, useState } from 'react';
import API from '../services/api';
import socket from '../sockets/socket';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';
import NewChatModal from '../components/NewChatModal';
import './MainChatPage.css';
import { toast } from 'react-toastify';

const MainChatPage = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [botRunning, setBotRunning] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await API.get('/chats');
      setChats(data);
    } catch (err) {
      console.error('Error fetching chats:', err.message);
    }
  };

  const toggleBot = () => {
    if (botRunning) {
      socket.emit('stopRandomBot');
      toast.info('Random Bot stopped');
    } else {
      socket.emit('startRandomBot');
      toast.success('Random Bot started');
    }
    setBotRunning(!botRunning);
  };

  const filteredChats = chats.filter((chat) =>
    `${chat.user.firstName} ${chat.user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="main-chat-container">
      <div className="sidebar">
        <h2>Chats</h2>
        <input
          type="text"
          placeholder="Search chats..."
          className="chat-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="new-chat-btn" onClick={() => setShowModal(true)}>
          + New Chat
        </button>
        <button className="toggle-bot-btn" onClick={toggleBot}>
          {botRunning ? '🛑 Stop Bot' : '🤖 Start Random Bot'}
        </button>
        <ChatList
          chats={filteredChats}
          setActiveChat={setActiveChat}
          refreshChats={fetchChats}
          activeChat={activeChat}
        />
        {showModal && (
          <NewChatModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              fetchChats();
              setShowModal(false);
            }}
          />
        )}
      </div>
      <div className="chatbox">
        {activeChat ? (
          <ChatBox chat={activeChat} />
        ) : (
          <div className="empty-chat">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainChatPage;
