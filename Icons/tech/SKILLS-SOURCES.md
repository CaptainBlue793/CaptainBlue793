# Profile skills

`skills-dark.svg` and `skills-light.svg` use the categories, order, technology
names and brand icons in `Portfolio/src/content.ts` and `Portfolio/src/BrandIcon.tsx`,
with profile overrides: omit GitHub, JavaScript and React, and rename Cloud to Deployment, adding Azure
alongside AWS. Both cloud providers use their names without service details.
The shorter category labels are Languages, Databases, AI/ML, Agents, Frontend,
APIs, Deployment and Tools.
They retain the original row design: neutral uppercase category labels on the
left, right-aligned brand logos, transparent backgrounds, and no tiles, terminal
markers, or dividers. Each logo has a small centered technology name below it.
Rows are 80 units high with 48-unit logos, 60-unit icon spacing and 10-unit captions.
Captions begin 64 units into each row, with 10 units between caption lines.
The final row has 12 fewer units of bottom padding to bring the footer closer.
Category labels use Cascadia Mono Bold outlines, preserving the font on all
devices without requiring an installed font. Technology captions retain Arial.
All eight categories and 28 technologies are displayed.
Technology names remain in accessible labels, SVG
titles/descriptions, and the README image's alternative text.
All images are embedded locally; no icon service is needed to display them.

To refresh from the sibling portfolio with its dependencies installed, run from
this repository:

```powershell
node scripts/sync-portfolio-skills.mjs
```

An alternate portfolio path can be supplied as the first argument.
The README uses relative URLs for the skills SVGs so it displays the version
from the current commit. The wave footer URL remains pinned to a published commit.

To rebuild the category outlines after changing labels, run
`scripts/build-category-labels.py` with the `starGPU` Python environment. It uses
fontTools and the installed `C:/Windows/Fonts/CascadiaMono.ttf` by default;
an alternate font file can be supplied with `--font`.

Icons copied from the portfolio retain their original geometry. Oracle uses its
portfolio brand red; AWS and black Simple Icons marks adapt to the theme.

- Devicon (MIT): Python, Java, MySQL, scikit-learn, OpenCV, Angular, AWS, and Jupyter.
  See [the license](../DEVICON-LICENSE.txt) and https://github.com/devicons/devicon.
- Simple Icons (CC0): C++, TypeScript, Snowflake, PyTorch, TensorFlow,
  spaCy, NVIDIA, Ollama, Streamlit, FastAPI, GraphQL, and Git.
  https://github.com/simple-icons/simple-icons
- Chroma: https://www.trychroma.com/ (colored logomark).
- Oracle: https://static.oracle.com/cdn/fnd/gallery/2610.0.0/images/ico-oracle-o.svg
- NLTK: https://www.nltk.org/_static/img/favicon-32x32.png
- LangGraph and LangChain: https://www.langchain.com/brand-assets and
  https://docs.langchain.com/oss/python/langgraph/overview (official standalone icons).
- SQL and REST APIs use the portfolio's generic database and code glyphs.
- Azure reuses the local vector mark from `stack-grid.svg` in `azure.svg`.
- Category outlines: Microsoft Cascadia Mono, https://github.com/microsoft/cascadia-code.
  See `CASCADIA-MONO-LICENSE.txt`. The font file itself is not redistributed.
- `wave-footer.svg` retains the original Capsule Render gradient and animations,
  with 28 units of empty top space cropped. The README places it immediately
  below the skills in the same paragraph. Original hosted markup is preserved
  in a README comment. Source: https://github.com/kyechan99/capsule-render (MIT).

Brand names and marks belong to their respective owners.
