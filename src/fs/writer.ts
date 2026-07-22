import { writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

export async function writeFileContent(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf-8')
}

export function createEdit(filePath: string, oldContent: string, newContent: string) {
  return { filePath, oldContent, newContent }
}
