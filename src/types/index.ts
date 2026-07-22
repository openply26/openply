export interface AgentContext {
  cwd: string
  files: string[]
  prompt: string
  history: Message[]
  config: Config
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

export interface Config {
  model: string
  localModel: string
  mode: 'local' | 'cloud' | 'auto'
  theme: 'light' | 'dark'
  adEnabled: boolean
  openRouterKey?: string
}

export interface FileEdit {
  filePath: string
  oldContent: string
  newContent: string
}

export interface AgentStep {
  type: 'plan' | 'edit' | 'review' | 'bash' | 'search' | 'message'
  content: string
  filePath?: string
}

export interface Plan {
  steps: AgentStep[]
  reasoning: string
}

export interface ReviewResult {
  approved: boolean
  issues: string[]
  suggestions: string[]
}

export interface AdPlacement {
  line: string
  url?: string
}

export interface AgentDefinition {
  id: string
  displayName: string
  model?: string
  instructionsPrompt: string
  toolNames: string[]
  handleSteps?: () => AsyncGenerator<{ tool: string; command?: string }, void, unknown>
}

export type ModelProvider = 'openrouter' | 'ollama'

export interface ModelConfig {
  id: string
  provider: ModelProvider
  displayName: string
  contextWindow: number
  collectsData: boolean
}
