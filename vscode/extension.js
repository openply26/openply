"use strict";
// VS Code Extension for openPly
// Provides a terminal-based interface within VS Code
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('openply.start', () => {
        const terminal = vscode.window.createTerminal('openPly');
        terminal.sendText('npx openply');
        terminal.show();
    });
    let explainCommand = vscode.commands.registerCommand('openply.explain', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor)
            return;
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        if (!text) {
            vscode.window.showInformationMessage('Select some code to explain');
            return;
        }
        const terminal = vscode.window.createTerminal('openPly');
        terminal.sendText(`echo "Explain this code:" && cat << 'EOF'\n${text}\nEOF`);
        terminal.show();
    });
    let chatCommand = vscode.commands.registerCommand('openply.chat', async () => {
        const prompt = await vscode.window.showInputBox({
            prompt: 'What do you want openPly to do?',
            placeHolder: 'Add authentication, fix the bug, refactor...',
        });
        if (prompt) {
            const terminal = vscode.window.createTerminal('openPly');
            terminal.sendText(`openply "${prompt.replace(/"/g, '\\"')}"`);
            terminal.show();
        }
    });
    context.subscriptions.push(disposable, explainCommand, chatCommand);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map