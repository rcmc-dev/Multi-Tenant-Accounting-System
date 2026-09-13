import { useEffect, useRef, useState } from 'react'

interface ChatMessage {
  from: 'bot' | 'user'
  text: string
}

const WELCOME: ChatMessage = {
  from: 'bot',
  text: 'Hi! 👋 Welcome to KitaBooks Support. Ask us anything about VAT, BIR forms, or your subscription.',
}

const QUICK_REPLIES = ['How to file 2550Q?', 'Pricing plans', 'Add a client book', 'Talk to a human']

const CANNED: { match: RegExp; reply: string }[] = [
  { match: /2550|vat|bir/i, reply: 'BIR Form 2550M/2550Q summaries are auto-computed under Financial Statements → VAT Summary. You can then export the figures for eBIR/EFPS filing. 📋' },
  { match: /pric|plan|cost|bayad|subscription/i, reply: 'We have 3 plans: Solo CPA at ₱499/mo, Firm at ₱1,499/mo, and custom Enterprise pricing. All plans include unlimited client books during beta! 💳' },
  { match: /client|book|tenant|add/i, reply: 'To add a client book, open the sidebar → Client (Tenant) dropdown. Each client\'s books are fully isolated. More self-serve tenant creation is coming soon! 🏢' },
  { match: /human|agent|person|tao/i, reply: 'Sure! A real human will join shortly. Meanwhile, you can email us at support@kitabooks.ph or call (02) 8-123-4567. 🧑‍💼' },
]

const FALLBACK = 'Thanks for reaching out! Our support team will get back to you shortly. For urgent concerns, email support@kitabooks.ph. 📧'

export function SupportChat() {
  const [open, setOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const replyTo = (text: string) => {
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      const hit = CANNED.find((c) => c.match.test(text))
      setMessages((ms) => [...ms, { from: 'bot', text: hit ? hit.reply : FALLBACK }])
    }, 900)
  }

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((ms) => [...ms, { from: 'user', text: trimmed }])
    setInput('')
    replyTo(trimmed)
  }

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed right-6 bottom-6 z-50 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-brand-600 text-2xl text-white shadow-lg shadow-brand-900/30 transition hover:scale-105 hover:bg-brand-700"
        onClick={() => {
          setOpen((o) => !o)
          setHasUnread(false)
        }}
        title="Customer Support"
      >
        {open ? '✕' : '💬'}
        {!open && hasUnread && (
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[0.65rem] font-bold">
            1
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 flex h-[26rem] w-90 max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-brand-900 px-4 py-3.5 text-white">
            <div className="relative">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-base font-bold text-brand-900">
                ₱
              </span>
              <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-brand-900 bg-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">KitaBooks Support</div>
              <div className="text-[0.7rem] text-green-300">● Online · replies in minutes</div>
            </div>
            <button
              className="cursor-pointer text-lg text-slate-300 hover:text-white"
              onClick={() => setOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.from === 'user'
                      ? 'rounded-br-sm bg-brand-600 text-white'
                      : 'rounded-bl-sm border border-gray-200 bg-white text-slate-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 border-t border-gray-100 bg-white px-3 pt-2.5 pb-1">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                className="cursor-pointer rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[0.72rem] font-medium text-brand-600 transition hover:bg-brand-100"
                onClick={() => send(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            className="flex items-center gap-2 bg-white px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <input
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-3.5 py-2 text-sm focus:outline-2 focus:outline-brand-600"
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary shrink-0 rounded-full px-3.5" title="Send">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}

