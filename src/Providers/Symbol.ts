import * as vscode from 'vscode'

export default class DynamicSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument): vscode.SymbolInformation[] {
        const result: vscode.SymbolInformation[] = []

        for (let line = 0; line < document.lineCount; line++) {
            const {text} = document.lineAt(line)

            const reg = new RegExp('^([A-Z][A-Z0-9-_]+)(?=\=)', 'g').exec(text)

            if (reg !== null) {
                const envKey = reg[1]
                const extractTag = /[A-Z0-9]+(?=[_-])/.exec(envKey)

                result.push(
                    new vscode.SymbolInformation(
                        envKey,
                        vscode.SymbolKind.Key,
                        extractTag ? extractTag[0] : envKey,
                        new vscode.Location(
                            document.uri,
                            new vscode.Range(
                                new vscode.Position(line, 0),
                                new vscode.Position(line, text.length),
                            ),
                        ),
                    ),
                )
            }
        }

        return result
    }
}
