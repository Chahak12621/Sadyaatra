"use client";
import React, { useState, useRef, useEffect } from "react";

const CSS = `
.chat-btn{position:fixed;bottom:28px;right:28px;z-index:1000;
  width:60px;height:60px;border-radius:50%;border:none;
  background:linear-gradient(135deg,#0ea5e9,#0369a1);
  box-shadow:0 8px 24px rgba(14,165,233,.4);
  cursor:pointer;font-size:1.6rem;transition:transform .3s cubic-bezier(0.34,1.56,0.64,1);}
.chat-btn img{width:48px;height:48px;object-fit:contain;border-radius:50%;}
.chat-window{position:fixed;bottom:100px;right:28px;z-index:1000;
  width:360px;height:500px;background:#fff;border-radius:20px;
  box-shadow:0 20px 60px rgba(0,0,0,.15);display:flex;flex-direction:column;
  overflow:hidden;animation:chat-in .3s cubic-bezier(0.34,1.56,0.64,1);}
@keyframes chat-in{from{opacity:0;transform:scale(.9) translateY(20px);}to{opacity:1;transform:scale(1) translateY(0);}}
@media(max-width:420px){.chat-window{width:calc(100vw - 24px);right:12px;}}
.chat-header{background:linear-gradient(135deg,#0ea5e9,#0369a1);padding:16px 18px;
  display:flex;align-items:center;gap:12px;flex-shrink:0;}
.chat-header-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);
  display:flex;align-items:center;justify-content:center;font-size:1.2rem;}
.chat-header-info{flex:1;}
.chat-header-name{font-weight:700;color:#fff;font-size:.95rem;}
.chat-header-status{font-size:.72rem;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:4px;}
.chat-header-dot{width:6px;height:6px;background:#4ade80;border-radius:50%;}
.chat-close{background:none;border:none;color:rgba(255,255,255,.8);font-size:1.2rem;cursor:pointer;padding:4px;}
.chat-close:hover{color:#fff;}
.chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}
.chat-messages::-webkit-scrollbar{width:4px;}
.chat-messages::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px;}
.msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:.87rem;line-height:1.55;word-break:break-word;}
.msg.user{background:linear-gradient(135deg,#0ea5e9,#0369a1);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}
.msg.bot{background:#f1f5f9;color:#0f172a;align-self:flex-start;border-bottom-left-radius:4px;}
.msg.typing{background:#f1f5f9;align-self:flex-start;border-bottom-left-radius:4px;}
.typing-dots{display:flex;gap:4px;padding:2px 4px;}
.typing-dots span{width:7px;height:7px;background:#94a3b8;border-radius:50%;animation:dot-bounce .9s infinite;}
.typing-dots span:nth-child(2){animation-delay:.15s;}
.typing-dots span:nth-child(3){animation-delay:.3s;}
@keyframes dot-bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}
.chat-input-row{padding:12px 14px;border-top:1px solid #f1f5f9;display:flex;gap:8px;flex-shrink:0;}
.chat-input{flex:1;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:12px;
  font-family:inherit;font-size:.88rem;outline:none;resize:none;transition:border-color .3s;
  max-height:80px;line-height:1.4;}
.chat-input:focus{border-color:#0ea5e9;}
.chat-send{width:38px;height:38px;background:linear-gradient(135deg,#0ea5e9,#0369a1);
  border:none;border-radius:10px;color:#fff;font-size:1rem;cursor:pointer;
  flex-shrink:0;transition:transform .2s;align-self:flex-end;}
.chat-send:hover{transform:scale(1.08);}
.chat-send:disabled{opacity:.5;transform:none;}
.chat-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;}
.chip{background:#f0f9ff;border:1px solid #bae6fd;border-radius:50px;
  padding:5px 12px;font-size:.75rem;color:#0369a1;font-weight:600;cursor:pointer;transition:all .2s;}
.chip:hover{background:#0ea5e9;color:#fff;border-color:#0ea5e9;}
`;

const SUGGESTIONS = [
  "Plan a trip to Rajasthan 🏰",
  "Best hill stations in India 🏔️",
  "Budget trip to Kerala 🌴",
  "Goa itinerary for 4 days 🏖️",
];

interface Msg { role: "user" | "bot"; text: string; }

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Namaste! 🙏 I'm your SadYaatra AI travel assistant. Where in India would you like to explore?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowChips(false);
    const userMsg: Msg = { role: "user", text };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = [...msgs, userMsg].map(m => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setMsgs(m => [...m, { role: "bot", text: data.reply }]);
    } catch {
      setMsgs(m => [...m, { role: "bot", text: "Sorry, I'm bit overwhelmed by the requests , Please try again! after sometimes 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-avatar">
              <img src="/sadyaatra-logo.png" alt="SadYaatra AI" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="chat-header-info">
              <div className="chat-header-name">SadYaatra AI</div>
              <div className="chat-header-status">
                <div className="chat-header-dot" /> Online · Travel Assistant
              </div>
            </div>
            <button className="chat-btn" onClick={() => setOpen(o => !o)}>
              {open ? "✕" : <img src="/sadyaatra-logo.png" alt="Chat" />}
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.text}</div>
            ))}
            {loading && (
              <div className="msg typing">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {showChips && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map(s => (
                <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-row">
            <textarea
              className="chat-input"
              placeholder="Ask me anything about travel..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
            />
            <button className="chat-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
     <button className="chat-btn" onClick={() => setOpen(o => !o)}>
  {open ? "✕" : <img src="/sadyaatra-logo.png" alt="Chat" />}
</button>
    </>
  );
}