"""Bake Cascadia Mono category labels into SVG paths using fontTools."""

import argparse
import json
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--font", default="C:/Windows/Fonts/CascadiaMono.ttf")
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
font = TTFont(args.font)
if "fvar" in font:
    font = instantiateVariableFont(font, {"wght": 700})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
units_per_em = font["head"].unitsPerEm
labels = {}


def coordinate(value):
    return f"{value:.2f}".rstrip("0").rstrip(".") or "0"


for title in ("Languages", "Databases", "AI/ML", "Agents", "Frontend", "APIs", "Deployment", "Tools"):
    pen = SVGPathPen(glyphs, ntos=coordinate)
    advance = 0
    for character in title.upper():
        glyph = glyphs[cmap[ord(character)]]
        glyph.draw(TransformPen(pen, (1, 0, 0, 1, advance, 0)))
        advance += glyph.width + 0.65 * units_per_em / 15
    labels[title] = {"path": pen.getCommands()}

output = root / "Icons/tech/cascadia-category-labels.json"
output.write_text(json.dumps({
    "fontFamily": "Cascadia Mono",
    "fontWeight": 700,
    "unitsPerEm": units_per_em,
    "labels": labels,
}, indent=2) + "\n", encoding="utf-8")
print(f"Built {len(labels)} Cascadia Mono labels in {output}")
