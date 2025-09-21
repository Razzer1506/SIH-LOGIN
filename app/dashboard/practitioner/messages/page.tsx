"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { motion } from "framer-motion"

const conversations = [
  {
    id: 1,
    patient: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the session today. I'm feeling much better!",
    timestamp: "1 hour ago",
    unread: 1,
    online: true,
    condition: "Stress Management",
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Should I continue with the current herbal supplements?",
    timestamp: "3 hours ago",
    unread: 2,
    online: false,
    condition: "Digestive Issues",
  },
  {
    id: 3,
    patient: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The Abhyanga treatment was amazing. When is my next appointment?",
    timestamp: "1 day ago",
    unread: 0,
    online: true,
    condition: "Joint Pain",
  },
]

const messages = [
  {
    id: 1,
    sender: "patient",
    content:
      "Hello Dr. Sharma! I wanted to update you on my progress. I've been following the diet plan you recommended.",
    timestamp: "2:30 PM",
    date: "Today",
  },
  {
    id: 2,
    sender: "practitioner",
    content:
      "That's wonderful to hear, John! How are you feeling overall? Any changes in your energy levels or sleep patterns?",
    timestamp: "2:35 PM",
    date: "Today",
  },
  {
    id: 3,
    sender: "patient",
    content:
      "Yes, my energy levels have improved significantly, and I'm sleeping much better. The stress levels have also decreased.",
    timestamp: "2:40 PM",
    date: "Today",
  },
  {
    id: 4,
    sender: "practitioner",
    content:
      "Excellent progress! I'm pleased to see the improvement. Let's continue with the current treatment plan. I'll also recommend some additional breathing exercises.",
    timestamp: "2:45 PM",
    date: "Today",
  },
  {
    id: 5,
    sender: "patient",
    content: "Thank you for the session today. I'm feeling much better!",
    timestamp: "3:00 PM",
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

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.condition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <PractitionerLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Messages</h1>
            <p className="text-emerald-600 mt-2">Communicate with your patients</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-emerald-900">Patient Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients..."
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
                            {conversation.patient
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
                          <p className="text-sm font-medium text-emerald-900 truncate">{conversation.patient}</p>
                          {conversation.unread > 0 && (
                            <Badge className="bg-emerald-500 text-white text-xs">{conversation.unread}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-emerald-600 truncate">{conversation.condition}</p>
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
                      {selectedConversation.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-emerald-900">{selectedConversation.patient}</h3>
                    <p className="text-xs text-emerald-600">
                      {selectedConversation.condition} •{" "}
                      {selectedConversation.online ? "Online" : "Last seen 1 hour ago"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
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
                      className={`flex ${message.sender === "practitioner" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          message.sender === "practitioner" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-900"
                        } rounded-lg p-3`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "practitioner" ? "text-emerald-100" : "text-gray-500"
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
    </PractitionerLayout>
  )
}
