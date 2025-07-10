import { useState } from "react";
import { Sparkles, Send, Search } from "lucide-react";
import "./MessagesPage.css";
import myAvatar from "../assets/profile.jpg";

// Mock chat data
const mockChats = {
  Samar: [
    { sender: "Samar", text: "Heyy how's SmartCatch going?", time: "10:01 AM" },
    { sender: "Me", text: "Haha slow but getting there 😅", time: "10:03 AM" },
    { sender: "Samar", text: "Lmk if you need help!", time: "10:05 AM" },
  ],
  Aziz: [
    { sender: "Aziz", text: "Did you eat?", time: "9:30 AM" },
    { sender: "Me", text: "Not yet, just coding this messaging page 😪", time: "9:32 AM" },
    { sender: "Aziz", text: "👀 take a break soon", time: "9:35 AM" },
  ],
  "SmartCatch Team": [
    { sender: "Teamleader", text: "Let’s meet tomorrow at 10", time: "08:30 AM" },
    { sender: "Me", text: "Sure, works for me!", time: "08:31 AM" },
    { sender: "Ahmed", text: "Same here", time: "08:32 AM" },
    { sender: "Samar", text: "Can we also discuss the frontend?", time: "08:35 AM" },
    { sender: "Aziz", text: "Yes please", time: "08:36 AM" },
  ],
};

const users = Object.keys(mockChats);

const userAvatars = {
  Samar: "https://randomuser.me/api/portraits/women/44.jpg",
  Aziz: "https://randomuser.me/api/portraits/men/46.jpg",
  Teamleader: "https://randomuser.me/api/portraits/women/65.jpg",
  Ahmed: "https://randomuser.me/api/portraits/men/36.jpg",
};

const MessagesPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
                  {mockChats[user]?.[mockChats[user].length - 1]?.text || ""}
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
              {mockChats[selectedUser]?.map((msg, i) => {
                const isMe = msg.sender === "Me";
                const avatarSrc = msg.sender === "Me" ? myAvatar : userAvatars[msg.sender] || myAvatar;

                return (
                  <div key={i} className={`chat-bubble-wrapper ${isMe ? "me" : "them"}`}>
                    {!isMe && (
                      <img src={avatarSrc} alt={`${msg.sender} avatar`} className="message-avatar" />
                    )}
                    <div className={`chat-bubble ${isMe ? "me" : "them"}`}>
                      <p>{msg.text}</p>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                    {isMe && (
                      <img src={avatarSrc} alt="My avatar" className="message-avatar" />
                    )}
                  </div>
                );
              })}
            </section>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setInput("");
              }}
              className="chat-input-bar"
            >
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