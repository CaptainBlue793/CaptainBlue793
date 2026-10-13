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
  dark: { text: '#F0F6FC', caption: '#c2c2c2', ink: '#ffffff' },
  light: { text: '#24292F', caption: '#536171', ink: '#181717' },
};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const canvasWidth = 676.6;
const iconSize = 48;
const iconStep = 60;
const rowHeight = 88;
const rightPadding = 12;
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
  const body = rows.map(({ title, items }, index) => {
    const top = index * rowHeight;
    const start = canvasWidth - rightPadding - iconSize - (items.length - 1) * iconStep;
    const technologies = items.map((name, itemIndex) => {
      const x = (start + itemIndex * iconStep).toFixed(1);
      const center = (Number(x) + iconSize / 2).toFixed(1);
      const lines = name.startsWith('AWS') ? ['AWS', name.slice(4)]
        : name === 'NVIDIA CUDA' ? ['NVIDIA', 'CUDA'] : [name];
      const caption = lines.map((line, lineIndex) => `<tspan x="${center}" y="${top + 68 + lineIndex * 12}">${escape(line)}</tspan>`).join('');
      return `<g aria-label="${escape(name)}"><title>${escape(name)}</title><g transform="translate(${x} ${top + 6}) scale(${iconSize / 24})">${icon(name, theme, palette.text)}</g><text fill="${palette.caption}" font-size="10" text-anchor="middle">${caption}</text></g>`;
    }).join('\n');
    return `<g data-category="${escape(title)}"><text x="0" y="${top + 36}" fill="${palette.text}" font-size="15" font-weight="700" letter-spacing="0.65">${escape(title.toUpperCase())}</text>\n${technologies}</g>`;
  }).join('\n');
  const description = rows.map(row => `${row.title}: ${row.items.join(', ')}`).join('; ');
  const height = rows.length * rowHeight;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${height}" viewBox="0 0 ${canvasWidth} ${height}" role="img" aria-labelledby="title desc" font-family="Arial,Helvetica,sans-serif">\n<title id="title">Palak Deb Patra — Skills</title>\n<desc id="desc">${escape(description)}</desc>\n${body}\n</svg>\n`;
  writeFileSync(resolve(root, `Icons/tech/skills-${theme}.svg`), svg);
}
console.log(`Synced ${rows.length} categories and ${rows.reduce((count, row) => count + row.items.length, 0)} technologies from ${portfolio}.`);
