import * as path from "path";
import * as vscode from "vscode";
import { runTests } from "@vscode/test-electron";
import { strict as assert } from "assert";

suite("Extension activation", () => {
  test("Commands registered", async () => {
    const ext = vscode.extensions.getExtension("blewis.rope-refactor");
    await ext?.activate();

    const cmds = await vscode.commands.getCommands(true); // true = exclude internal
    assert.ok(cmds.includes("ropeRefactor.rename"));
    assert.ok(cmds.includes("ropeRefactor.extractMethod"));
  });
});
