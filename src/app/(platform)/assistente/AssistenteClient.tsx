"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AssistenteClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou o Assistente IA da MatchRH. Como posso te ajudar hoje? Você pode me perguntar sobre os dados da plataforma, candidatos ou funcionamento do sistema."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Falha na resposta da IA");
      }
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Erro: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-8 max-w-4xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-[#3ecf8e]/10 p-2.5 rounded-xl border border-[#3ecf8e]/20">
          <Bot className="h-6 w-6 text-[#3ecf8e]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Assistente MatchRH <Sparkles className="h-4 w-4 text-[#3ecf8e]" />
          </h1>
          <p className="text-sm text-zinc-400">
            Tire dúvidas e consulte informações da sua base de dados instantaneamente
          </p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col shadow-xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === "user" 
                  ? "bg-zinc-800 text-zinc-400" 
                  : "bg-[#3ecf8e] text-zinc-950"
              }`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm ${
                msg.role === "user"
                  ? "bg-zinc-800 text-white rounded-tr-none"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-tl-none whitespace-pre-wrap"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#3ecf8e] text-zinc-950 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-[#3ecf8e] animate-spin" />
                <span className="text-xs text-zinc-500 font-medium">Pensando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <form onSubmit={handleSubmit} className="flex gap-3 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo como: 'Quantas vagas abertas temos?'"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#3ecf8e]/50 focus:border-[#3ecf8e]/50 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#3ecf8e] text-zinc-950 rounded-xl px-4 flex items-center justify-center hover:bg-[#34b279] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-zinc-600">A IA pode cometer erros. Considere verificar as informações importantes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
