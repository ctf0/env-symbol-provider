import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.registerUriHandler({
            handleUri(provider) {
                let {authority, fragment, query} = provider

                if (authority == 'ctf0.env-symbol-provider') {
                    vscode.env.clipboard.writeText(fragment)
                    vscode.window.showInformationMessage(
                        `Env Symbol Provider: ${query} Value Copied To Clipboard`,
                    )
                }
            }
        })
    )

    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            {language: "env"}, new DynamicSymbolProvider()
        )
    )
}

class DynamicSymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(document: vscode.TextDocument): vscode.SymbolInformation[] {

        const result: vscode.SymbolInformation[] = []

        for (let line = 0; line < document.lineCount; line++) {
            const { text } = document.lineAt(line)

            let reg = new RegExp('(([a-zA-Z0-9]+[_-]?)+)(=)(.*)', 'g').exec(text)

            if (reg !== null) {
                let envKey = reg[1]
                let envValue = reg[4] || ''
                let extractTag = /[a-zA-Z0-9]+(?=[_-])/.exec(envKey)

                let copyValueToClipboardUri = vscode.Uri
                    .parse(document.uri.toString())
                    .with({ authority: 'ctf0.env-symbol-provider', query: envKey, fragment: envValue})

                result.push(
                    new vscode.SymbolInformation(
                        envKey,
                        vscode.SymbolKind.Key,
                        extractTag ? extractTag[0] : envKey,
                        new vscode.Location(
                            copyValueToClipboardUri,
                            new vscode.Range(new vscode.Position(line,0),
                            new vscode.Position(line,text.length - 1))
                        )
                    )
                )
            }
        }

        return result
    }
}

// this method is called when your extension is deactivated
export function deactivate() { }
