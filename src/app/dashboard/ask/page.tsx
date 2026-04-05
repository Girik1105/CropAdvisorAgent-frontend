'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { api } from '@/lib/api'
import { Field } from '@/lib/types'

interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export default function AskAgentPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [fieldId, setFieldId] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.getFields().then((data) => {
      setFields(data)
      if (data.length > 0) setFieldId(data[0].id)
    })
  }, [])

  // Load chat history when field changes
  useEffect(() => {
    if (!fieldId) return
    setMessages([])
    api.getChatHistory(fieldId).then((history) => {
      setMessages(
        history.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'agent',
          content: m.content,
          timestamp: new Date(m.created_at),
        }))
      )
    })
  }, [fieldId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || !fieldId || loading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setError('')
    setLoading(true)

    try {
      const res = await api.chatWithAgent({ message: userMsg.content, field_id: fieldId })
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: res.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMsg])
    } catch {
      setError('Failed to get a response. Please try again.')
    }
    setLoading(false)
  }

  const selectedField = fields.find((f) => f.id === fieldId)

  return (
    <div className="flex flex-col h-full pt-14 lg:pt-0">
      {/* Header */}
      <div className="px-6 py-4 border-b border-grid flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-primary text-[22px] font-semibold tracking-wide">
              Ask Agent
            </h1>
            <p className="font-editorial italic text-text/40 text-[13px] mt-0.5">
              Chat with the AI advisor about your fields
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-text/30">
              Field
            </span>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              className="bg-paper border border-grid rounded-lg px-3 py-2 text-[13px] text-text focus:outline-none focus:border-primary/40 transition-colors"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
        {selectedField && (
          <div className="flex items-center gap-3 mt-2 text-[11px] text-text/30 font-mono">
            <span>{selectedField.crop_type}</span>
            <span>·</span>
            <span>{selectedField.area_acres} acres</span>
            <span>·</span>
            <span>{selectedField.lat.toFixed(3)}°, {selectedField.lng.toFixed(3)}°</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5l-3 3V3z" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-text mb-1">Ask anything about your field</p>
              <p className="text-[13px] text-text/40 leading-relaxed">
                The agent uses your field&apos;s latest data to give personalized answers.
                No tools are called — responses are instant.
              </p>
              <div className="flex flex-wrap gap-2 mt-5 justify-center">
                {[
                  "Should I irrigate today?",
                  "What pests should I watch for?",
                  "How's my soil health?",
                  "What growth stage is my crop in?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-[12px] text-text/50 bg-paper border border-grid rounded-full px-3.5 py-1.5 hover:border-sand hover:text-text/70 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-paper border border-grid text-text rounded-bl-sm'
              }`}
            >
              {msg.role === 'agent' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-accent" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="8" r="6" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">CropAdvisor</span>
                </div>
              )}
              {msg.role === 'user' ? (
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap text-white">
                  {msg.content}
                </p>
              ) : (
                <div className="text-[14px] leading-relaxed text-text/80 prose prose-sm max-w-none prose-p:my-2 prose-strong:text-text prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:text-text prose-headings:text-[15px] prose-headings:mt-3 prose-headings:mb-1">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
              <p className={`text-[10px] mt-1.5 ${
                msg.role === 'user' ? 'text-white/50' : 'text-text/25'
              }`}>
                {msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-paper border border-grid rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-accent" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="8" r="6" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">CropAdvisor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-text/20 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-text/20 typing-dot" />
                <div className="w-2 h-2 rounded-full bg-text/20 typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-2 bg-critical/10 border border-critical/20 rounded-lg px-4 py-2 text-critical text-[13px]">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-grid flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your field..."
            disabled={loading || !fieldId}
            className="flex-1 bg-paper border border-grid rounded-xl px-4 py-3 text-[14px] text-text placeholder:text-text/25 focus:outline-none focus:border-primary/40 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !fieldId}
            className="bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-white p-3 rounded-xl transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2L7 9M14 2l-5 12-2-5-5-2 12-5z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
