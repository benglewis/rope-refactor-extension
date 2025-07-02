from __future__ import annotations

from pathlib import Path
import json
import subprocess
import sys
import textwrap

EXE = Path(__file__).parents[1] / "rope_refactor.py"


def _run(payload: dict[str, object]) -> None:
    subprocess.run(
        [sys.executable, EXE, json.dumps(payload)],
        cwd=payload["workspace"],
        check=True,
        capture_output=True,
        text=True,
    )


def test_rename(tmp_path: Path) -> None:
    code = tmp_path / "mod.py"
    code.write_text("def foo():\n    pass\nfoo()\n")

    txt = code.read_text()
    offset = txt.rindex("foo")  # pick the *call-site* reference

    _run(
        {
            "action": "rename",
            "workspace": str(tmp_path),
            "file": str(code),
            "offset": offset,
            "newName": "bar",
        }
    )

    out = code.read_text()
    assert "def bar()" in out
    assert "bar()" in out.splitlines()[-1]  # call site updated


def test_extract_method(tmp_path: Path) -> None:
    code = tmp_path / "m.py"
    code.write_text(
        textwrap.dedent(
            """
            def f():
                a = 1 + 2
                return a
            """
        )
    )

    txt = code.read_text()
    start = txt.index("1")
    end = txt.index("2") + 1  # Rope expects *end* to be exclusive

    _run(
        {
            "action": "extract_method",
            "workspace": str(tmp_path),
            "file": str(code),
            "start": start,
            "end": end,
            "newName": "add",
        }
    )

    out = code.read_text()
    assert "def add(" in out
    assert "add()" in out
