'use client'

import { useConversation } from '@11labs/react'

export default function VoiceWidget() {
  const conversation = useConversation()
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

  if (!agentId) return null

  const handleStart = async () => {
    await conversation.startSession({ agentId })
  }

  const isConnected = conversation.status === 'connected'

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <button
        onClick={isConnected ? conversation.endSession : handleStart}
        className={`text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-2 ${
          isConnected
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-accent hover:bg-accent/90 text-white'
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-300 animate-pulse' : 'bg-white/50'
          }`}
        />
        {isConnected ? 'End Conversation' : 'Talk to Agent'}
      </button>
    </div>
  )
}
