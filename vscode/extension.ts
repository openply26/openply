// VS Code Extension for openPly
// Provides a terminal-based interface within VS Code

import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('openply.start', () => {
    const terminal = vscode.window.createTerminal('openPly')
    terminal.sendText('npx openply')
    terminal.show()
  })

  let explainCommand = vscode.commands.registerCommand('openply.explain', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) return

    const selection = editor.selection
    const text = editor.document.getText(selection)

    if (!text) {
      vscode.window.showInformationMessage('Select some code to explain')
      return
    }

    const terminal = vscode.window.createTerminal('openPly')
    terminal.sendText(`echo "Explain this code:" && cat << 'EOF'\n${text}\nEOF`)
    terminal.show()
  })

  let chatCommand = vscode.commands.registerCommand('openply.chat', async () => {
    const prompt = await vscode.window.showInputBox({
      prompt: 'What do you want openPly to do?',
      placeHolder: 'Add authentication, fix the bug, refactor...',
    })

    if (prompt) {
      const terminal = vscode.window.createTerminal('openPly')
      terminal.sendText(`openply "${prompt.replace(/"/g, '\\"')}"`)
      terminal.show()
    }
  })

  context.subscriptions.push(disposable, explainCommand, chatCommand)
}

export function deactivate() {}
