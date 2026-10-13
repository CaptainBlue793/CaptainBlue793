// Run from this repository: node scripts/sync-portfolio-skills.mjs [portfolio-path]
// Uses the portfolio's existing assets and installed Simple Icons package.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const portfolio = resolve(process.argv[2] ?? resolve(root, '../Portfolio'));
const require = createRequire(resolve(portfolio, 'package.json'));
const icons = require('simple-icons');
const content = readFileSync(resolve(portfolio, 'src/content.ts'), 'utf8');
const section = content.split("id: 'skills',")[1]?.split("id: 'work',")[0];
if (!section) throw new Error('Cannot locate the portfolio Skills section.');
const rows = [...section.matchAll(/title: '([^']+)',\s*description: '([^']+)'/g)]
  .map(([, title, description]) => ({ title, items: description.split(' · ') }));
if (!rows.length) throw new Error('No portfolio skills found.');

const assets = {
  Python: 'python.svg', Java: 'java.svg', Oracle: 'oracle.svg', MySQL: 'mysql.svg',
  ChromaDB: 'chromadb.svg', 'scikit-learn': 'scikitlearn.svg', OpenCV: 'opencv.svg',
  NLTK: 'nltk.png', LangGraph: 'langgraph.png', LangChain: 'langchain.png',
  Angular: 'angular.svg', AWS: 'aws.svg', Jupyter: 'jupyter.svg',
};
const simple = {
  'C++': 'siCplusplus', JavaScript: 'siJavascript', TypeScript: 'siTypescript',
  Snowflake: 'siSnowflake', PyTorch: 'siPytorch', TensorFlow: 'siTensorflow',
  spaCy: 'siSpacy', 'NVIDIA CUDA': 'siNvidia', Ollama: 'siOllama',
  React: 'siReact', Streamlit: 'siStreamlit', FastAPI: 'siFastapi',
  GraphQL: 'siGraphql', Git: 'siGit', GitHub: 'siGithub',
};
const themes = {
  dark: { text: '#c2c2c2', ink: '#ffffff', border: '#353535', colors: ['#a4cdf2', '#a4d7a3', '#cdb9ee', '#a3d9de', '#e5d6a3', '#efb1b7', '#e6b4d8'] },
  light: { text: '#536171', ink: '#181717', border: '#dce3ec', colors: ['#155dc6', '#147543', '#7a3bb8', '#00747e', '#8b5700', '#bb354a', '#ab2b80'] },
};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
function icon(name, theme, accent) {
  const key = name.startsWith('AWS') ? 'AWS' : name;
  if (assets[key]) {
    const file = key === 'AWS' && theme === 'dark' ? 'aws-dark.svg' : assets[key];
    const data = readFileSync(resolve(portfolio, 'public/images/brands', file));
    if (file.endsWith('.png')) {
      const background = key === 'NLTK' ? '<rect width="24" height="24" rx="2" fill="#ffffff"/>' : '';
      return `${background}<image width="24" height="24" href="data:image/png;base64,${data.toString('base64')}"/>`;
    }
    // Nest the original vector geometry so proportions and gradients are retained.
    return data.toString('utf8').replace(/<\?xml[^>]*\?>/g, '').replace(/<svg\b([^>]*)>/, (_, attributes) => {
      const resized = attributes.replace(/\s(?:width|height)="[^"]*"/g, '');
      return `<svg${resized} width="24" height="24">`;
    }).replaceAll(key === 'Oracle' ? '#100f0e' : '__unused__', '#C74634');
  }
  const brand = icons[simple[key]];
  if (brand) {
    const fill = ['000000', '181717', '0F0F11'].includes(brand.hex) ? themes[theme].ink : `#${brand.hex}`;
    return `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="${fill}" d="${brand.path}"/></svg>`;
  }
  if (key !== 'SQL' && key !== 'REST APIs') throw new Error(`Missing portfolio icon: ${key}`);
  const path = key === 'SQL'
    ? '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>'
    : '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>';
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="${accent}" stroke-width="1.6">${path}</svg>`;
}

for (const [theme, palette] of Object.entries(themes)) {
  let top = 0;
  const body = rows.map(({ title, items }, index) => {
    const accent = palette.colors[index % palette.colors.length];
    let x = 320;
    let line = 0;
    const technologies = items.map(name => {
      const width = 32 + name.length * 10.8;
      if (x + width > 1024 && x > 320) { x = 320; line += 1; }
      const y = top + 16 + line * 38;
      const item = `<g aria-label="${escape(name)}"><title>${escape(name)}</title><g transform="translate(${x} ${y})">${icon(name, theme, accent)}</g><text x="${x + 32}" y="${y + 18}" fill="${palette.text}">${escape(name)}</text></g>`;
      x += width + 24;
      return item;
    }).join('\n');
    const height = 58 + line * 38;
    const row = `<g data-category="${escape(title)}"><text x="16" y="${top + 34}" fill="${accent}" font-weight="600">&gt;&gt; ${escape(title)}</text>\n${technologies}</g>`;
    top += height;
    return row + (index < rows.length - 1 ? `\n<path d="M16 ${top}H1024" stroke="${palette.border}" stroke-dasharray="4 5"/>` : '');
  }).join('\n');
  const description = rows.map(row => `${row.title}: ${row.items.join(', ')}`).join('; ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="${top}" viewBox="0 0 1040 ${top}" role="img" aria-labelledby="title desc" font-family="Consolas,Liberation Mono,monospace" font-size="18">\n<title id="title">Palak Deb Patra — Skills</title>\n<desc id="desc">${escape(description)}</desc>\n${body}\n</svg>\n`;
  writeFileSync(resolve(root, `Icons/tech/skills-${theme}.svg`), svg);
}
console.log(`Synced ${rows.length} categories and ${rows.reduce((count, row) => count + row.items.length, 0)} technologies from ${portfolio}.`);
