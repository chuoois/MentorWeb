// src/bot/floating-chatbot.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // THÊM DÒNG NÀY
import AIService from "@/services/ai.service";
import { MessageCircle, Send, X, Bot, User, Loader2, UserCheck, ArrowRight } from "lucide-react";

export const Chatbot = () => {
  const navigate = useNavigate(); // Hook điều hướng
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là cố vấn AI. Bạn muốn tìm mentor về kỹ năng gì? (VD: React, Node.js, hệ thống lớn, khởi nghiệp...)",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), text: input, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await AIService.chatMentorAdvisor({ message: input });

      if (res.data.success && res.data.data?.recommended?.length > 0) {
        const mentors = res.data.data.recommended;

        const aiMsg = {
          id: Date.now() + 1,
          type: "mentors",
          mentors,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const aiMsg = {
          id: Date.now() + 1,
          text: "Hiện chưa tìm thấy mentor phù hợp. Bạn thử mô tả chi tiết hơn nhé!",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        text: "Lỗi kết nối. Vui lòng thử lại.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // XỬ LÝ ĐIỀU HƯỚNG
  const goToMentorDetail = (mentorId) => {
    navigate(`/mentor/${mentorId}`);
    setIsOpen(false); // Đóng chatbot sau khi click
  };

  const MentorCard = ({ mentor }) => (
    <div
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
      onClick={() => goToMentorDetail(mentor.mentorId)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
          <UserCheck size={18} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Tên mentor */}
          <h4 className="font-semibold text-sm text-gray-900">{mentor.full_name}</h4>

          {/* Lý do – HIỂN THỊ ĐẦY ĐỦ, CÓ THỂ XEM THÊM */}
          <div className="mt-2 text-xs text-gray-700 leading-relaxed">
            <p className="whitespace-pre-wrap">
              {mentor.reason}
            </p>
          </div>

          {/* Nút xem chi tiết */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToMentorDetail(mentor.mentorId);
            }}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Xem hồ sơ chi tiết <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Nút nổi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 sm:w-96 md:w-[420px] md:h-[540px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Tìm Mentor AI</h3>
                <p className="text-xs opacity-90">Đề xuất mentor phù hợp</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X size={16} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.type === "mentors" ? (
                  <div className="w-full max-w-full space-y-4">
                    <p className="text-xs font-medium text-gray-700">
                      Đề xuất {msg.mentors.length} mentor phù hợp:
                    </p>
                    <div className="space-y-4">
                      {msg.mentors.map((mentor) => (
                        <MentorCard key={mentor.mentorId} mentor={mentor} />
                      ))}
                    </div>
                  </div>
                ) : (
                  // Tin nhắn văn bản bình thường
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs ${msg.sender === "ai" ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gray-600"
                      }`}>
                      {msg.sender === "ai" ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 shadow-sm"
                      }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Đang tìm mentor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="VD: Tìm mentor React + Node.js..."
                className="flex-1 resize-none border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};