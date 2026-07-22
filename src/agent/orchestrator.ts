import { AgentContext, AgentStep, FileEdit, Plan, ReviewResult, Message, AgentDefinition } from '../types'
import { LLMClient } from '../llm/client'
import { PLANNER_PROMPT, EDITOR_PROMPT, REVIEWER_PROMPT, SYSTEM_PROMPT, buildFileContext } from '../llm/prompts'
import { readFileContent } from '../fs/reader'
import { writeFileContent } from '../fs/writer'
import { findProjectFiles, searchFiles } from '../fs/search'
import { runBash } from '../bash/executor'
import { generateDiff, formatDiff } from '../utils/diff'
import { info, success, warn, renderDiff } from '../utils/display'
import { showProcessingAnimation, showEditAnimation } from '../utils/splash'
import { loadProjectAgents } from './loader'
import { loadKnowledge } from '../knowledge/loader'
import { getBuiltinAgents } from '../registry/registry'

export class Orchestrator {
  private llm: LLMClient
  private context: AgentContext
  private knowledge: string
  private projectAgents: AgentDefinition[]

  constructor(llm: LLMClient, context: AgentContext) {
    this.llm = llm
    this.context = context
    this.knowledge = ''
    this.projectAgents = []
  }

  async init(): Promise<void> {
    this.knowledge = await loadKnowledge(this.context.cwd)
    this.projectAgents = await loadProjectAgents(this.context.cwd)
  }

  async run(userPrompt: string): Promise<{ edits: FileEdit[]; review: ReviewResult | null }> {
    const agentMention = this.resolveAgentMention(userPrompt)
    const enrichedPrompt = agentMention
      ? `[Agent: ${agentMention.displayName}]\n${agentMention.instructionsPrompt}\n\nUser request: ${userPrompt.replace(/@\w+/g, '').trim()}`
      : userPrompt

    let systemPrompt = SYSTEM_PROMPT
    if (this.knowledge) {
      systemPrompt += `\n\n## Project Knowledge\n${this.knowledge}`
    }
    const allAgents = [...getBuiltinAgents(), ...this.projectAgents]
    if (allAgents.length > 0) {
      systemPrompt += `\n\n## Available Agents (use @AgentName to invoke)\n${allAgents.map(a => `- @${a.id}: ${a.displayName} — ${a.instructionsPrompt.slice(0, 100)}`).join('\n')}`
    }

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...this.context.history.slice(-10),
      { role: 'user', content: enrichedPrompt },
    ]

    const done = await showProcessingAnimation('agents analyzing request')
    const plan = await this.createPlan(messages)
    done()

    return this.executePlan(plan)
  }

  private resolveAgentMention(prompt: string): AgentDefinition | null {
    const match = prompt.match(/@(\w+)/)
    if (!match) return null
    const id = match[1]
    const builtin = getBuiltinAgents().find(a => a.id === id)
    if (builtin) return builtin
    return this.projectAgents.find(a => a.id === id) || null
  }

  private async createPlan(messages: Message[]): Promise<Plan> {
    const planMessages: Message[] = [
      { role: 'system', content: PLANNER_PROMPT },
      ...messages,
    ]

    const response = await this.llm.chat(planMessages)

    try {
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim())
      if (parsed.steps && parsed.reasoning) {
        info(`Plan: ${parsed.reasoning}`)
        return parsed
      }
    } catch { /* fall through */ }

    return {
      reasoning: 'Direct execution',
      steps: [{ type: 'message', content: response }],
    }
  }

  private async executePlan(plan: Plan): Promise<{ edits: FileEdit[]; review: ReviewResult | null }> {
    const edits: FileEdit[] = []

    for (const step of plan.steps) {
      switch (step.type) {
        case 'search': {
          const results = await searchFiles(step.content, this.context.cwd)
          info(`Found ${results.length} files matching "${step.content}"`)
          break
        }
        case 'bash': {
          const result = runBash(step.content, this.context.cwd)
          if (result.exitCode === 0) success(`Command succeeded: ${step.content}`)
          else warn(`Command exited with code ${result.exitCode}: ${result.stderr}`)
          break
        }
        case 'edit': {
          if (!step.filePath) {
            warn('Edit step has no filePath, skipping')
            continue
          }
          showEditAnimation(step.filePath)
          const oldContent = await readFileContent(step.filePath)
          const editMessages: Message[] = [
            { role: 'system', content: EDITOR_PROMPT },
            { role: 'user', content: `File: ${step.filePath}\n\n${buildFileContext([step.filePath], [oldContent])}\n\nRequest: ${step.content}` },
          ]
          const newContent = await this.llm.chat(editMessages)
          await writeFileContent(step.filePath, newContent)
          const diff = formatDiff(generateDiff(step.filePath, oldContent, newContent))
          edits.push({ filePath: step.filePath, oldContent, newContent })
          renderDiff(diff)
          break
        }
        case 'message': {
          console.log(step.content)
          break
        }
        default: {
          info(`Unknown step type: ${step.type}`)
        }
      }
    }

    let review: ReviewResult | null = null
    if (edits.length > 0) {
      review = await this.reviewChanges(edits)
    }

    return { edits, review }
  }

  private async reviewChanges(edits: FileEdit[]): Promise<ReviewResult> {
    const reviewMessages: Message[] = [
      { role: 'system', content: REVIEWER_PROMPT },
      { role: 'user', content: edits.map(e =>
        `File: ${e.filePath}\n${generateDiff(e.filePath, e.oldContent, e.newContent)}`
      ).join('\n\n') },
    ]

    const response = await this.llm.chat(reviewMessages)

    try {
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim())
      if (parsed.approved !== undefined) {
        if (parsed.approved) success('Review passed')
        else {
          warn('Review found issues:')
          parsed.issues?.forEach((i: string) => warn(`  - ${i}`))
        }
        return parsed
      }
    } catch { /* fall through */ }

    return { approved: true, issues: [], suggestions: [] }
  }
}
