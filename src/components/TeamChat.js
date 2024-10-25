import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { MessageSquare } from "lucide-react"

// Mock data for teams (in a real app, this would be fetched from an API)
const teams = [
  { id: 1, name: "NB Rockz", avatar: "N", brief: "Team brief goes here...", createdAt: "Sun, Oct 08, 2023, 12:17 am", size: 3, maxSize: 5, lead: "John Doe", aim: "To develop innovative AI solutions", isFull: false },
  { id: 2, name: "USER00003586", avatar: "/placeholder.svg?height=40&width=40", brief: "Team brief goes here...", createdAt: "Sun, Oct 08, 2023, 12:00 am", size: 5, maxSize: 5, lead: "Jane Smith", aim: "To create sustainable eco-friendly products", isFull: true },
  { id: 3, name: "EcoSmart Solutions: AI-Powered Sustainability", avatar: "/placeholder.svg?height=40&width=40", brief: "Team brief goes here...", createdAt: "Tue, Oct 03, 2023, 12:04 am", size: 2, maxSize: 4, lead: "Alex Johnson", aim: "To integrate AI into sustainability practices", isFull: false },
  { id: 4, name: "coders_123456", avatar: "A", brief: "Team brief goes here...", createdAt: "Tue, Oct 03, 2023, 11:59 pm", size: 4, maxSize: 6, lead: "Sam Brown", aim: "To build cutting-edge web applications", isFull: false },
]

export default function TeamChat() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const teamData = teams.find(t => t.id === parseInt(id))
    setTeam(teamData)
  }, [id])

  if (!team) {
    return <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <p className="text-blue-600 text-xl">Loading...</p>
    </div>
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "You", timestamp: new Date().toLocaleTimeString() }])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Team Explorer</h1>
        </div>
      </header>
      <div className="container mx-auto px-4">
        <Button onClick={() => navigate(-1)} className="mb-8 bg-blue-600 hover:bg-blue-700">Back to Team Details</Button>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-blue-800">{team.name} - Team Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full border border-blue-200 rounded-md p-4 mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-bold text-blue-600">{msg.sender}:</span> <span className="text-blue-800">{msg.text}</span>
                  <span className="text-xs text-blue-400 ml-2">{msg.timestamp}</span>
                </div>
              ))}
            </ScrollArea>
            <div className="flex">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage()
                  }
                }}
                className="mr-2"
              />
              <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}