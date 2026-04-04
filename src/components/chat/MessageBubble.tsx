import { Message } from '@/lib/types'

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2.5`}>
      <div
        className={`max-w-[85%] px-4 py-2.5 text-[14px] leading-relaxed ${
          isUser
            ? 'bg-[#3b82f6] text-white rounded-2xl rounded-br-sm'
            : 'bg-[#E5E2D8] text-[#2C2C28] rounded-2xl rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
