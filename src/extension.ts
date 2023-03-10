import * as vscode from 'vscode'
import HoverProvider from './Providers/Hover'
import SymbolProvider from './Providers/Symbol'
import * as util from './util'

const langs = ['env', 'dotenv']

export function activate(context: vscode.ExtensionContext) {
    util.readConfig()

    context.subscriptions.push(
        // config
        vscode.workspace.onDidChangeConfiguration(async(e) => {
            if (e.affectsConfiguration(util.PACKAGE_NAME)) {
                util.readConfig()
            }
        }),
        // providers
        vscode.languages.registerDocumentSymbolProvider(langs, new SymbolProvider()),
        vscode.languages.registerHoverProvider(langs, new HoverProvider()),
    )
}

export function deactivate() { }
