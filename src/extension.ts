import * as vscode from "vscode";
import { runRope } from "./ropeBridge";
import { getOffset } from "./util";

export function activate(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand("ropeRefactor.rename", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const newName = await vscode.window.showInputBox({ prompt: "New name" });
      if (!newName) {
        return;
      }

      const offset = getOffset(editor.document, editor.selection.active);
      await runRope({
        action: "rename",
        workspace:
          vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri
            .fsPath ?? "",
        file: editor.document.uri.fsPath,
        offset,
        newName,
      });
    }),

    vscode.commands.registerCommand("ropeRefactor.extractMethod", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.selection.isEmpty) {
        return;
      }
      const name = await vscode.window.showInputBox({
        prompt: "Method name",
        value: "extracted",
      });
      if (!name) {
        return;
      }

      await runRope({
        action: "extract_method",
        workspace:
          vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri
            .fsPath ?? "",
        file: editor.document.uri.fsPath,
        start: getOffset(editor.document, editor.selection.start),
        end: getOffset(editor.document, editor.selection.end),
        newName: name,
      });
    })
  );
}

export function deactivate(): void {
  /* nothing */
}
