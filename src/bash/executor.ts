import { execSync } from 'child_process'

export interface BashResult {
  stdout: string
  stderr: string
  exitCode: number
}

export function runBash(command: string, cwd: string): BashResult {
  try {
    const stdout = execSync(command, { cwd, encoding: 'utf-8', timeout: 30000 })
    return { stdout: stdout.trim(), stderr: '', exitCode: 0 }
  } catch (err: any) {
    return {
      stdout: err.stdout?.toString().trim() || '',
      stderr: err.stderr?.toString().trim() || err.message,
      exitCode: err.status ?? 1,
    }
  }
}
