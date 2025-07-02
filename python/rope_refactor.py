from __future__ import annotations

import json
import sys
from pathlib import Path

from rope.base.project import Project
from rope.refactor.rename import Rename
from rope.refactor.extract import ExtractMethod


def _rel_resource(project: Project, workspace: Path, abs_path: str):
    """Return the Rope resource for *abs_path* inside *workspace*."""
    abs_file = Path(abs_path).resolve()
    rel_path = abs_file.relative_to(workspace.resolve())
    # get_resource returns File / Folder for a *relative* path
    return project.get_resource(str(rel_path))


def _rename(project: Project, ws: Path, data: dict[str, object]) -> None:
    res = _rel_resource(project, ws, str(data["file"]))
    offset: int = int(data["offset"])
    change = Rename(project, res, offset).get_changes(str(data["newName"]))
    project.do(change)


def _extract_method(project: Project, ws: Path, data: dict[str, object]) -> None:
    res = _rel_resource(project, ws, str(data["file"]))
    start: int = int(data["start"])
    end: int = int(data["end"])
    change = ExtractMethod(project, res, start, end).get_changes(str(data["newName"]))
    project.do(change)


DISPATCH = {
    "rename": _rename,
    "extract_method": _extract_method,
}


def main() -> None:
    payload = json.loads(sys.argv[1])
    workspace = Path(payload["workspace"]).resolve()
    proj = Project(str(workspace))
    try:
        DISPATCH[payload["action"]](proj, workspace, payload)
    finally:
        proj.close()


if __name__ == "__main__":
    main()