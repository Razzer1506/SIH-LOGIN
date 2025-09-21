"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"
import { PatientLayout } from "@/components/layouts/patient-layout"
import { motion } from "framer-motion"

const conversations = [
  {
    id: 1,
    practitioner: "Dr. Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Your progress looks great! Let's schedule your next session.",
    timestamp: "2 hours ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    practitioner: "Dr. Raj Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Please continue with the prescribed herbs for another week.",
    timestamp: "1 day ago",
    unread: 0,
    online: false,
  },
]

const messages = [
  {
    id: 1,
    sender: "practitioner",
    content: "Hello John! I've reviewed your latest progress report. Your wellness scores are improving significantly.",
    timestamp: "10:30 AM",
    date: "Today",
  },
  {
    id: 2,
    sender: "patient",
    content: "Thank you, Dr. Sharma! I've been following the diet plan religiously and doing the yoga exercises daily.",
    timestamp: "10:35 AM",
    date: "Today",
  },
  {
    id: 3,
    sender: "practitioner",
    content:
      "That's wonderful to hear! I can see the improvement in your energy levels and sleep quality. How are you feeling overall?",
    timestamp: "10:40 AM",
    date: "Today",
  },
  {
    id: 4,
    sender: "patient",
    content: "Much better! My stress levels have decreased significantly, and I'm sleeping much better now.",
    timestamp: "10:45 AM",
    date: "Today",
  },
  {
    id: 5,
    sender: "practitioner",
    content:
      "Excellent! Let's schedule your next Abhyanga session for next week. I'll also adjust your herbal supplements based on your progress.",
    timestamp: "10:50 AM",
    date: "Today",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.practitioner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <PatientLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Messages</h1>
            <p className="text-emerald-600 mt-2">Communicate with your practitioners</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search practitioners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 cursor-pointer hover:bg-emerald-50 transition-colors ${
                      selectedConversation.id === conversation.id ? "bg-emerald-50 border-r-2 border-emerald-500" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {conversation.practitioner
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-emerald-900 truncate">{conversation.practitioner}</p>
                          {conversation.unread > 0 && (
                            <Badge className="bg-emerald-500 text-white text-xs">{conversation.unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 border-emerald-200 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {selectedConversation.practitioner
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-emerald-900">{selectedConversation.practitioner}</h3>
                    <p className="text-xs text-emerald-600">
                      {selectedConversation.online ? "Online" : "Last seen 2 hours ago"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <Separator />

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.sender === "patient" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-900"
                        } rounded-lg p-3`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "patient" ? "text-emerald-100" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <Separator />
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-emerald-500 hover:bg-emerald-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  )
}
