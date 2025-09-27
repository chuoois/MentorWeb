import { useState } from "react"
import { Send, Search, MoreVertical, Phone, Video, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const chatUsers = [
  {
    id: "1",
    name: "Alex Chen",
    lastMessage: "Cảm ơn thầy/cô đã góp ý cho dự án của em!",
    timestamp: "2 phút trước",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    lastMessage: "Chúng ta có thể lên lịch gọi điện trong tuần này không?",
    timestamp: "1 giờ trước",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "David Kim",
    lastMessage: "Em đã nộp bài tập rồi",
    timestamp: "3 giờ trước",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Emma Wilson",
    lastMessage: "Mong chờ buổi học tiếp theo của chúng ta",
    timestamp: "1 ngày trước",
    unread: 0,
    online: false,
  },
]

const messages = [
  {
    id: "1",
    content: "Chào TS. Johnson! Em muốn cảm ơn thầy/cô vì những góp ý chi tiết cho đề xuất dự án của em.",
    timestamp: "10:30 SA",
    isOwn: false,
    sender: "Alex Chen",
  },
  {
    id: "2",
    content: "Không có gì đâu Alex! Thầy/cô rất vui vì góp ý hữu ích. Dự án của em có tiềm năng lớn.",
    timestamp: "10:32 SA",
    isOwn: true,
    sender: "TS. Sarah Johnson",
  },
  {
    id: "3",
    content: "Em đã chỉnh sửa theo gợi ý rồi. Em có nên nộp lại đề xuất không?",
    timestamp: "10:35 SA",
    isOwn: false,
    sender: "Alex Chen",
  },
  {
    id: "4",
    content: "Ừ, em nộp lại đi nhé. Thầy/cô sẽ xem và phản hồi vào ngày mai.",
    timestamp: "10:36 SA",
    isOwn: true,
    sender: "TS. Sarah Johnson",
  },
  {
    id: "5",
    content: "Cảm ơn thầy/cô đã góp ý cho dự án của em!",
    timestamp: "10:38 SA",
    isOwn: false,
    sender: "Alex Chen",
  },
]

export const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(chatUsers[0])
  const [newMessage, setNewMessage] = useState("")
  const [showChatList, setShowChatList] = useState(true)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Xử lý gửi tin nhắn
      setNewMessage("")
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setShowChatList(false) // Ẩn danh sách chat trên mobile khi chọn người dùng
  }

  return (
    <div className="flex h-full">
      {/* Danh sách chat */}
      <div className={cn("w-full lg:w-80 border-r border-border bg-card", !showChatList && "hidden lg:block")}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">Tin nhắn</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm cuộc trò chuyện..." className="pl-10 bg-background" />
          </div>
        </div>

        <div className="overflow-y-auto">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              className={cn(
                "p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors",
                selectedUser.id === user.id && "bg-accent",
              )}
              onClick={() => handleUserSelect(user)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  {user.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-card-foreground truncate">{user.name}</h3>
                    <span className="text-xs text-muted-foreground">{user.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                    {user.unread > 0 && (
                      <Badge variant="default" className="ml-2 px-2 py-0.5 text-xs">
                        {user.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Khu vực chat */}
      <div className={cn("flex-1 flex flex-col", showChatList && "hidden lg:flex")}>
        {/* Header chat */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Nút quay lại cho mobile */}
              <Button variant="ghost" size="sm" onClick={() => setShowChatList(true)} className="lg:hidden">
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                {selectedUser.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.online ? "Đang hoạt động" : "Hoạt động gần nhất 2 giờ trước"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung tin nhắn */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xs sm:max-w-sm lg:max-w-md px-4 py-2 rounded-lg",
                  message.isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground/70",
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ô nhập tin nhắn */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
