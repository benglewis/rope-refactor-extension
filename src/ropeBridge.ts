import { promisify } from "node:util";
import { execFile } from "node:child_process";
import * as vscode from "vscode";

const exec = promisify(execFile);

export async function runRope(params: Record<string, unknown>): Promise<void> {
  const py =
    vscode.workspace.getConfiguration("python").get<string>("pythonPath") ??
  "python";
  const script = vscode.Uri.joinPath(
    vscode.extensions.getExtension("blewis.rope-refactor")!.extensionUri,
    "python",
    "rope_refactor.py"
  ).fsPath;

  try {
    const { stderr } = await exec(py, [script, JSON.stringify(params)]);
    if (stderr) {
      vscode.window.showErrorMessage(stderr);
    }
  } catch (err: any) {
    vscode.window.showErrorMessage(`Rope failed: ${err.stderr ?? err.message}`);
  }
}
