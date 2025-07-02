"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffset = getOffset;
function getOffset(doc, pos) {
    return doc.offsetAt(pos);
}
