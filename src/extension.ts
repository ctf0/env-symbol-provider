import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
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

            let reg = new RegExp('^(([a-zA-Z0-9]+[_-]?)+)(?=\=)', 'g').exec(text)

            if (reg !== null) {
                let envKey = reg[1]
                let extractTag = /[a-zA-Z0-9]+(?=[_-])/.exec(envKey)

                result.push(
                    new vscode.SymbolInformation(
                        envKey,
                        vscode.SymbolKind.Key,
                        extractTag ? extractTag[0] : envKey,
                        new vscode.Location(
                            document.uri,
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
