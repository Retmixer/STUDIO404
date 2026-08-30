const fs = require('fs');
const path = require('path');

const root = __dirname;
const files = ['data.js', 'engine.js', 'audio.js', 'ui.js', 'main.js'];

function read(name) {
  return fs.readFileSync(path.join(root, 'src', name), 'utf8');
}

function stripModules(code) {
  return code
    .split('\n')
    .filter((line) => !/^\s*import\s/.test(line))
    .map((line) => (/^\s*export\s/.test(line) ? line.replace(/^\s*export\s+/, '') : line))
    .join('\n');
}

const bundle = files.map(read).map(stripModules).join('\n\n');

const html = `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#171a2e" />
    <title>STUDIO 404 — Создай игру</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
${fs.readFileSync(path.join(root, 'styles.css'), 'utf8')}
    </style>
  </head>
  <body>
    <div id="app" class="app-shell"></div>
    <div id="toast-region" class="toast-region" aria-live="polite"></div>
    <script>
${bundle}
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');
console.log(`Bundled ${bundle.split('\n').length} lines of JS; wrote index.html (${html.length} bytes) — self-contained, opens via file:// without a server`);
