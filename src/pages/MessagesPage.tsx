import React, { useState, useEffect } from "react";
import { Sparkles, Send, Search, Trash2 } from "lucide-react";
import "./MessagesPage.css";
import myAvatar from "../assets/profile.jpg";

// Mock chat data
const userAvatars = {
  Samar: "https://randomuser.me/api/portraits/women/44.jpg",
  Aziz: "https://randomuser.me/api/portraits/men/46.jpg",
  Teamleader: "https://randomuser.me/api/portraits/women/65.jpg",
  Ahmed: "https://randomuser.me/api/portraits/men/36.jpg",
};

interface Message {
  sender: string;
  text: string;
  time: string;
  id: string;
}

const users = [
  "Samar",
  "Aziz",
  "SmartCatch Team",
  "Mom",
  "Project X",
  "Football Buddies",
  "Sister",
  "Book Club"
];

const API_URL = "http://localhost:3001";

const MessagesPage = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async (user: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/messages/${encodeURIComponent(user)}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Could not load messages. Please try again.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
    } else {
      setMessages([]);
      setError(null);
    }
  }, [selectedUser]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: "Me", text: input, time };
    setInput("");
    try {
      await fetch(`${API_URL}/messages/${encodeURIComponent(selectedUser)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      await fetchMessages(selectedUser);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleDelete = async (id: string) => {
    if (!selectedUser) return;
    try {
      await fetch(`${API_URL}/messages/${encodeURIComponent(selectedUser)}/${id}`, {
        method: "DELETE",
      });
      await fetchMessages(selectedUser);
    } catch (err) {
      // Optionally handle error
    }
  };

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <header className="chat-header">
          <img src={myAvatar} alt="My avatar" className="chat-avatar" />
          <div>
            <h3 className="chat-user">Rahma</h3>
          </div>
        </header>

        <h2 className="sidebar-title">Messages</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Search className="search-icon" />
        </div>

        <div className="user-list">
          {filteredUsers.length === 0 && <p className="no-users">No users found.</p>}
          {filteredUsers.map((user) => (
            <div
              key={user}
              onClick={() => setSelectedUser(user)}
              className={`user-item ${selectedUser === user ? "selected" : ""}`}
            >
              <img
                src={userAvatars[user] || myAvatar}
                alt={`${user} avatar`}
                className="avatar"
              />
              <div className="user-info">
                <p className="user-name">{user}</p>
                <p className="last-message">
                  {/* Show last message if available */}
                  {selectedUser === user
                    ? messages[messages.length - 1]?.text || ""
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="separator" />

      {/* Chat panel */}
      <main className="chat-panel">
        {selectedUser ? (
          <>
            <header className="chat-header">
              <img
                src={userAvatars[selectedUser] || myAvatar}
                alt={`${selectedUser} avatar`}
                className="chat-avatar"
              />
              <div>
                <h3 className="chat-user">{selectedUser}</h3>
                <p className="chat-status">Online</p>
              </div>
            </header>

            <section className="chat-messages">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : messages.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center' }}>No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender === "Me";
                  const avatarSrc = isMe ? myAvatar : userAvatars[msg.sender] || myAvatar;
                  return (
                    <div key={msg.id} className={`chat-bubble-wrapper ${isMe ? "me" : "them"}`}>
                      {!isMe && (
                        <img src={avatarSrc} alt={`${msg.sender} avatar`} className="message-avatar" />
                      )}
                      <div className={`chat-bubble ${isMe ? "me" : "them"}`}>
                        <p>{msg.text}</p>
                        <span className="chat-time">{msg.time}</span>
                        {isMe && (
                          <button
                            type="button"
                            onClick={() => handleDelete(msg.id)}
                            title="Delete message"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8, color: '#f87171', verticalAlign: 'middle' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      {isMe && (
                        <img src={avatarSrc} alt="My avatar" className="message-avatar" />
                      )}
                    </div>
                  );
                })
              )}
            </section>

            <form onSubmit={handleSend} className="chat-input-bar">
              <input
                type="text"
                value={input}
                placeholder={`Message ${selectedUser}...`}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={!input.trim()} className="send-button">
                <Send className="send-icon" />
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <Sparkles className="placeholder-icon" />
            <p className="placeholder-text">Select a conversation to start chatting ✨</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;