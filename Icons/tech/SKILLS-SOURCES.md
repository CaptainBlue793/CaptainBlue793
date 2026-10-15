# Profile skills

`skills-dark.svg` and `skills-light.svg` use the categories, order, technology
names and brand icons in `Portfolio/src/content.ts` and `Portfolio/src/BrandIcon.tsx`,
with profile overrides: omit GitHub and rename Cloud to Deployment, adding Azure
(Blob Storage, Azure VM, Azure SQL Database) alongside AWS.
They retain the original row design: neutral uppercase category labels on the
left, right-aligned brand logos, transparent backgrounds, and no tiles, terminal
markers, or dividers. Each logo has a small centered technology name below it.
Rows are 88 units high with 48-unit logos and 10-unit captions. Deployment uses
112 units and 100-unit icon spacing to fit the AWS and Azure service captions.
All eight categories and 30 technologies are displayed.
Technology names and cloud service details remain in accessible labels, SVG
titles/descriptions, and the README image's alternative text.
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
  spaCy, NVIDIA, Ollama, React, Streamlit, FastAPI, GraphQL, and Git.
  https://github.com/simple-icons/simple-icons
- Chroma: https://www.trychroma.com/ (colored logomark).
- Oracle: https://static.oracle.com/cdn/fnd/gallery/2610.0.0/images/ico-oracle-o.svg
- NLTK: https://www.nltk.org/_static/img/favicon-32x32.png
- LangGraph and LangChain: https://www.langchain.com/brand-assets and
  https://docs.langchain.com/oss/python/langgraph/overview (official standalone icons).
- SQL and REST APIs use the portfolio's generic database and code glyphs.
- Azure reuses the local vector mark from `stack-grid.svg` in `azure.svg`.

Brand names and marks belong to their respective owners.
