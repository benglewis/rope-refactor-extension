import * as vscode from "vscode";

export function getOffset(
  doc: vscode.TextDocument,
  pos: vscode.Position
): number {
  return doc.offsetAt(pos);
}
