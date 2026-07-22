import OpenAI from 'openai'
import { ModelConfig, Message } from '../types'

export class LLMClient {
  private client: OpenAI | null = null
  private model: string

  constructor(model: string, apiKey?: string) {
    this.model = model
    if (apiKey) {
      this.client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey,
        defaultHeaders: {
          'HTTP-Referer': 'https://openply.dev',
          'X-Title': 'openPly',
        },
      })
    }
  }

  static createLocal(baseUrl = 'http://localhost:11434/v1') {
    const client = new LLMClient('local')
    client.client = new OpenAI({ baseURL: baseUrl, apiKey: 'ollama' })
    return client
  }

  async chat(messages: Message[], onToken?: (token: string) => void): Promise<string> {
    if (!this.client) throw new Error('No LLM client configured. Run `openply config` to set up.')

    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
      max_tokens: 64000,
    })

    let full = ''
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || ''
      full += text
      onToken?.(text)
    }
    return full
  }
}
