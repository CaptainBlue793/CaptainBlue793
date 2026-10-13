# Profile skills

`skills-dark.svg` and `skills-light.svg` mirror the categories, order, technology
names, brand icons, and category colors in `Portfolio/src/content.ts`,
`Portfolio/src/BrandIcon.tsx`, and `Portfolio/src/styles.css`.
They use category rows, inline icon/name pairs, and dashed dividers.
Text uses 24-unit type and icons use 32-unit squares. Technology lists wrap
between whole icon/name pairs, and long category names wrap within their column.
All images are embedded locally; no icon service is needed to display them.

To refresh from the sibling portfolio with its dependencies installed, run from
this repository:

```powershell
node scripts/sync-portfolio-skills.mjs
```

An alternate portfolio path can be supplied as the first argument.

Icons copied from the portfolio retain their original geometry. Oracle uses its
portfolio brand red; AWS and black Simple Icons marks adapt to the theme.

- Devicon (MIT): Python, Java, MySQL, scikit-learn, OpenCV, Angular, AWS, and Jupyter.
  See [the license](../DEVICON-LICENSE.txt) and https://github.com/devicons/devicon.
- Simple Icons (CC0): C++, JavaScript, TypeScript, Snowflake, PyTorch, TensorFlow,
  spaCy, NVIDIA, Ollama, React, Streamlit, FastAPI, GraphQL, Git, and GitHub.
  https://github.com/simple-icons/simple-icons
- Chroma: https://www.trychroma.com/ (colored logomark).
- Oracle: https://static.oracle.com/cdn/fnd/gallery/2610.0.0/images/ico-oracle-o.svg
- NLTK: https://www.nltk.org/_static/img/favicon-32x32.png
- LangGraph and LangChain: https://www.langchain.com/brand-assets and
  https://docs.langchain.com/oss/python/langgraph/overview (official standalone icons).
- SQL and REST APIs use the portfolio's generic database and code glyphs.

Brand names and marks belong to their respective owners.
