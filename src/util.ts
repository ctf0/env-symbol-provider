import * as vscode from 'vscode'

export function getFileSymbols(uri: vscode.Uri) {
    return vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri)
}

/* Config ------------------------------------------------------------------- */
export const PACKAGE_NAME = 'envSymbolProvider'
export let config: vscode.WorkspaceConfiguration

export function readConfig() {
    config = vscode.workspace.getConfiguration(PACKAGE_NAME)
}
