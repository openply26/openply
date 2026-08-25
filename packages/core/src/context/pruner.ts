import { Message } from '../types'

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function estimateMessagesTokens(messages: Message[]): number {
  return messages.reduce((sum, m) => sum + estimateTokens(m.content) + 4, 0)
}

export interface PruneResult {
  messages: Message[]
  droppedCount: number
  tokensBefore: number
  tokensAfter: number
}

export function pruneMessages(messages: Message[], budgetTokens: number): PruneResult {
  const tokensBefore = estimateMessagesTokens(messages)
  if (tokensBefore <= budgetTokens) {
    return { messages, droppedCount: 0, tokensBefore, tokensAfter: tokensBefore }
  }

  const system = messages.filter(m => m.role === 'system')
  const rest = messages.filter(m => m.role !== 'system')
  const systemTokens = estimateMessagesTokens(system)
  const available = Math.max(budgetTokens - systemTokens, 1000)

  const kept: Message[] = []
  let used = 0
  let dropped = 0

  for (let i = rest.length - 1; i >= 0; i--) {
    const t = estimateTokens(rest[i].content) + 4
    if (used + t > available - 500 && kept.length > 4) {
      dropped = i + 1
      break
    }
    kept.unshift(rest[i])
    used += t
  }

  if (dropped > 0) {
    kept.unshift({
      role: 'user',
      content: `[${dropped} earlier messages omitted to fit context budget]`,
    })
  }

  const final = [...system, ...kept]
  return { messages: final, droppedCount: dropped, tokensBefore, tokensAfter: estimateMessagesTokens(final) }
}

export async function summarizeWithLLM(
  messages: Message[],
  chat: (msgs: Message[]) => Promise<string>,
  budgetTokens: number,
): Promise<Message[]> {
  const system = messages.filter(m => m.role === 'system')
  const rest = messages.filter(m => m.role !== 'system')
  const keepCount = Math.min(6, rest.length)
  const toSummarize = rest.slice(0, rest.length - keepCount)
  const kept = rest.slice(rest.length - keepCount)

  if (toSummarize.length === 0) return messages

  const transcript = toSummarize
    .map(m => `${m.role}: ${m.content.slice(0, 2000)}`)
    .join('\n\n')

  const summary = await chat([
    { role: 'system', content: 'Summarize this coding conversation. Keep: the goal, key decisions, files modified, errors hit and fixes, current state. Be under 400 words. Output only the summary.' },
    { role: 'user', content: transcript },
  ])

  return [
    ...system,
    { role: 'user', content: `<conversation_summary>\n${summary.trim()}\n</conversation_summary>` },
    ...kept,
  ]
}
