import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Send, Bot, User } from "lucide-react";

// This is a mock function to simulate AI response. In a real application, this would be an API call.
const mockAIVerification = async (idea) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
  return `Your idea "${idea}" has been verified. Here's some feedback: [AI-generated feedback would go here]`;
};

export default function IdeaVerification() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newUserMessage = { text: inputValue, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const aiResponse = await mockAIVerification(inputValue);
      const newAIMessage = { text: aiResponse, sender: "ai" };
      setMessages((prev) => [...prev, newAIMessage]);
    } catch (error) {
      console.error("Error verifying idea:", error);
      const errorMessage = {
        text: "Sorry, there was an error verifying your idea. Please try again.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Idea Verification</h1>
        </div>
      </header>
      <div className="container mx-auto px-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Submit Your Idea for AI Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full border border-blue-200 rounded-md p-4 mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${
                    msg.sender === "ai" ? "justify-start" : "justify-end"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <Bot className="w-6 h-6 text-blue-600 mr-2 mt-1" />
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      msg.sender === "ai"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <User className="w-6 h-6 text-blue-600 ml-2 mt-1" />
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start mb-4 justify-start">
                  <Bot className="w-6 h-6 text-blue-600 mr-2 mt-1" />
                  <div className="rounded-lg p-3 bg-blue-100 text-blue-800">
                    Verifying your idea...
                  </div>
                </div>
              )}
            </ScrollArea>
            <div className="flex">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your idea here..."
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleSendMessage();
                  }
                }}
                className="mr-2"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}