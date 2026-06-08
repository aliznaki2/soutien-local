import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('sl_chat');
    return saved ? JSON.parse(saved) : [
      { id: 1, sender: 'tutor', text: 'Bonjour ! Comment puis-je vous aider ?', time: '10:00' },
      { id: 2, sender: 'me', text: 'Bonjour, j\'aimerais réserver une séance de mathématiques.', time: '10:02' },
      { id: 3, sender: 'tutor', text: 'Parfait ! Quelles sont vos disponibilités ?', time: '10:05' },
    ];
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sl_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    // Simulate tutor response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'tutor',
        text: 'C\'est noté ! Je vous confirme cela très vite.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '32px 24px', maxWidth: 800, height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: 0, marginBottom: 16, alignSelf: 'flex-start' }}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {/* Chat Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
            T
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Tuteur Virtuel</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> En ligne
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(msg => {
            const isMe = msg.sender === 'me';
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', padding: '12px 16px', borderRadius: 20,
                  borderBottomRightRadius: isMe ? 4 : 20,
                  borderBottomLeftRadius: isMe ? 20 : 4,
                  background: isMe ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  color: isMe ? 'white' : 'var(--text-primary)',
                  boxShadow: 'var(--shadow-sm)', fontSize: 14, lineHeight: 1.5
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {msg.time} {isMe && <CheckCircle size={10} color="var(--accent-primary)" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={sendMessage} style={{ padding: 16, borderTop: '1px solid var(--border-light)', background: 'var(--bg-primary)', display: 'flex', gap: 12 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Écrivez votre message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={!message.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
