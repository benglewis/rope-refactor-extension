"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ropeBridge_1 = require("./ropeBridge");
const util_1 = require("./util");
function activate(ctx) {
    ctx.subscriptions.push(vscode.commands.registerCommand("ropeRefactor.rename", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const newName = await vscode.window.showInputBox({ prompt: "New name" });
        if (!newName) {
            return;
        }
        const offset = (0, util_1.getOffset)(editor.document, editor.selection.active);
        await (0, ropeBridge_1.runRope)({
            action: "rename",
            workspace: vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri
                .fsPath ?? "",
            file: editor.document.uri.fsPath,
            offset,
            newName,
        });
    }), vscode.commands.registerCommand("ropeRefactor.extractMethod", async () => {
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
        await (0, ropeBridge_1.runRope)({
            action: "extract_method",
            workspace: vscode.workspace.getWorkspaceFolder(editor.document.uri)?.uri
                .fsPath ?? "",
            file: editor.document.uri.fsPath,
            start: (0, util_1.getOffset)(editor.document, editor.selection.start),
            end: (0, util_1.getOffset)(editor.document, editor.selection.end),
            newName: name,
        });
    }));
}
function deactivate() {
    /* nothing */
}
