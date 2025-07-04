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
exports.runRope = runRope;
const node_util_1 = require("node:util");
const node_child_process_1 = require("node:child_process");
const vscode = __importStar(require("vscode"));
const exec = (0, node_util_1.promisify)(node_child_process_1.execFile);
async function runRope(params) {
    const py = vscode.workspace.getConfiguration("python").get("pythonPath") ??
        "python";
    const script = vscode.Uri.joinPath(vscode.extensions.getExtension("blewis.rope-refactor").extensionUri, "python", "rope_refactor.py").fsPath;
    try {
        const { stderr } = await exec(py, [script, JSON.stringify(params)]);
        if (stderr) {
            vscode.window.showErrorMessage(stderr);
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(`Rope failed: ${err.stderr ?? err.message}`);
    }
}
