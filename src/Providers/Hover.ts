import * as vscode from 'vscode'
import * as util from '../util'

export default class HoverProvider implements vscode.HoverProvider {
    async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | undefined> {
        if (!document || document?.isClosed) {
            return
        }

        const currentWord = document.getWordRangeAtPosition(position)
        const symbolsList: any = await util.getFileSymbols(document.uri)
        const symbol = symbolsList.find((symbol) => symbol.name === document.getText(currentWord))

        if (symbol && currentWord && !symbol.range.start.isEqual(currentWord.start)) {
            return new vscode.Hover(
                new vscode.MarkdownString(document.getText(symbol.range), true),
                document.getWordRangeAtPosition(position),
            )
        }
    }
}
