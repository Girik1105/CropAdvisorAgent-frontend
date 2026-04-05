'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Message, AgentResponse } from '@/lib/types'
import { api } from '@/lib/api'
import MessageBubble from './MessageBubble'

interface PhoneMockupProps {
  onResponse?: (response: AgentResponse) => void
}

// ── Call Tab ──
function CallTab() {
  const [callState, setCallState] = useState<'idle' | 'active'>('idle')
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (callState !== 'active') return
    setSeconds(0)
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [callState])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  if (callState === 'idle') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#2D4A3E]/20 flex items-center justify-center mb-3">
          <span className="text-[18px] text-[#5B7C6B] font-bold">CA</span>
        </div>
        <p className="text-white text-[16px] font-medium">CropAdvisor</p>
        <p className="text-white/35 text-[12px] mt-0.5">AI Farming Agent</p>
        <button
          onClick={() => setCallState('active')}
          className="mt-8 w-14 h-14 rounded-full bg-[#22c55e] flex items-center justify-center shadow-lg shadow-green-500/25 hover:bg-[#16a34a] transition-colors"
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </button>
        <p className="text-white/25 text-[11px] mt-3">Tap to call</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-14 h-14 rounded-full bg-[#2D4A3E]/20 flex items-center justify-center mb-2">
        <span className="text-[16px] text-[#5B7C6B] font-bold">CA</span>
      </div>
      <p className="text-white text-[15px] font-medium">CropAdvisor</p>
      <p className="text-white/30 text-[11px] mt-0.5">Connected via ElevenLabs</p>

      {/* Timer */}
      <p className="text-white/60 text-[28px] font-mono mt-5 tabular-nums">{formatTime(seconds)}</p>

      {/* Waveform */}
      <div className="flex items-end justify-center gap-[3px] h-10 mt-4">
        {[0.7, 1.0, 0.5, 1.3, 0.8, 1.1, 0.6, 0.9].map((speed, i) => (
          <div
            key={i}
            className="w-[3px] bg-[#5B7C6B] rounded-full"
            style={{
              animation: `waveform-bar ${speed}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              height: '30%',
            }}
          />
        ))}
      </div>

      {/* End call */}
      <button
        onClick={() => setCallState('idle')}
        className="mt-8 w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/25 hover:bg-red-600 transition-colors"
      >
        <svg className="w-6 h-6 text-white rotate-[135deg]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </button>
      <p className="text-white/25 text-[11px] mt-3">End call</p>
    </div>
  )
}

// ── Main PhoneMockup ──
export default function PhoneMockup({ onResponse }: PhoneMockupProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'call'>('text')
  const [messages, setMessages] = useState<Message[]>([
    { id: 'seed-1', role: 'user', content: "How's my cotton field looking?" },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  useEffect(scrollToBottom, [messages, typingText, isThinking])

  const typeResponse = useCallback((text: string) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true)
      let i = 0
      const interval = setInterval(() => {
        i++
        setTypingText(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setIsTyping(false)
          setTypingText('')
          setMessages((prev) => [
            ...prev,
            { id: `agent-${Date.now()}`, role: 'agent', content: text },
          ])
          resolve()
        }
      }, 30)
    })
  }, [])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isThinking || isTyping) return

    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: text },
    ])

    setIsThinking(true)

    try {
      const response = await api.sendMessage({
        phone_number: '+16812911561',
        message: text,
      })

      setIsThinking(false)
      onResponse?.(response)
      await typeResponse(response.response)
    } catch {
      setIsThinking(false)
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: 'agent', content: 'Sorry, something went wrong.' },
      ])
    }
  }

  return (
    <div className="w-[320px] mx-auto">
      {/* Phone frame */}
      <div className="bg-[#0a0a0a] rounded-[40px] border-[6px] border-[#1a1a1a] overflow-hidden shadow-2xl shadow-black/40">
        {/* Dynamic island */}
        <div className="flex justify-center pt-2">
          <div className="w-[90px] h-[24px] bg-[#1a1a1a] rounded-full" />
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-1 pb-2">
          <span className="text-[12px] text-white/50 font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-[2px] items-end">
              {[4, 6, 8, 10].map((h, i) => (
                <div key={i} className={`w-[3px] rounded-sm bg-white/${i < 3 ? '50' : '20'}`} style={{ height: `${h}px` }} />
              ))}
            </div>
            <svg className="w-4 h-4 text-white/50" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="5" width="10" height="6" rx="1" opacity="0.5" />
              <rect x="11.5" y="6.5" width="2" height="3" rx="0.5" opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex mx-4 mb-1 bg-white/5 rounded-lg p-0.5">
          {(['text', 'call'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/35 hover:text-white/50'
              }`}
            >
              {tab === 'text' ? 'Text' : 'Call'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="h-[380px] flex flex-col">
          {activeTab === 'text' ? (
            <div key="text" className="tab-fade-enter flex-1 flex flex-col">
              {/* Contact header */}
              <div className="flex items-center gap-2.5 px-4 py-2 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#2D4A3E]/30 flex items-center justify-center">
                  <span className="text-[11px] text-[#5B7C6B] font-bold">CA</span>
                </div>
                <div>
                  <p className="text-white text-[14px] font-medium leading-tight">CropAdvisor</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B7C6B]" />
                    <span className="text-[10px] text-white/30">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-3 py-3">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {isTyping && typingText && (
                  <div className="flex justify-start mb-2.5">
                    <div className="max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed bg-[#E5E2D8] text-[#2C2C28] rounded-2xl rounded-bl-sm">
                      {typingText}
                      <span className="inline-block w-0.5 h-4 bg-[#2C2C28]/50 ml-0.5 animate-pulse" />
                    </div>
                  </div>
                )}

                {isThinking && (
                  <div className="flex justify-start mb-2.5">
                    <div className="px-5 py-3 bg-[#E5E2D8] rounded-2xl rounded-bl-sm flex gap-1.5">
                      <span className="typing-dot w-2 h-2 bg-[#2C2C28]/40 rounded-full" />
                      <span className="typing-dot w-2 h-2 bg-[#2C2C28]/40 rounded-full" />
                      <span className="typing-dot w-2 h-2 bg-[#2C2C28]/40 rounded-full" />
                    </div>
                  </div>
                )}

              </div>

              {/* Input */}
              <div className="px-3 py-2.5 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your field..."
                    disabled={isThinking || isTyping}
                    className="flex-1 bg-white/10 text-white text-[14px] px-4 py-2.5 rounded-full placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#5B7C6B]/50 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isThinking || isTyping || !input.trim()}
                    className="w-9 h-9 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-opacity"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1l-7 7h4v7h6V8h4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div key="call" className="tab-fade-enter flex-1 flex flex-col">
              <CallTab />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
