// Dependency-free static packaging. Only website files enter dist/.
import { copyFile, lstat, mkdir, readdir, realpath, rm } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { supabaseConfig } from '../js/supabase-config.js';
import { validateConfig } from '../js/services/admin.mjs';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(root, 'dist');
const files = [];
const extensions = new Set(['.html', '.css', '.js', '.mjs', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.avif', '.woff', '.woff2', '.ttf', '.mp4', '.webm', '.pdf']);

async function collect(source) {
  const info = await lstat(source);
  if (info.isSymbolicLink()) throw new Error(`Symlink tidak didukung dalam file website: ${relative(root, source)}`);
  if (info.isDirectory()) {
    for (const name of await readdir(source)) {
      if (!name.startsWith('.')) await collect(join(source, name));
    }
  } else if (info.isFile() && extensions.has(source.slice(source.lastIndexOf('.')).toLowerCase())) files.push(source);
}

// Validate the public config and source files before replacing an existing build.
validateConfig(supabaseConfig);
for (const entry of ['index.html', 'contoh-project.html', 'admin', 'css', 'js', 'assets']) {
  await collect(join(root, entry));
}

// Recursive removal is restricted to the real repository's generated dist folder.
if (dirname(output) !== root || relative(root, output) !== 'dist') throw new Error('Target build tidak aman.');
const existing = await lstat(output).catch(error => {
  if (error.code !== 'ENOENT') throw error;
  return null;
});
if (existing && (!existing.isDirectory() || existing.isSymbolicLink() || await realpath(output) !== output)) {
  throw new Error('dist harus berupa folder biasa di dalam repository.');
}
console.log(`Output build: ${output}`);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const source of files) {
  const destination = join(output, relative(root, source));
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}
console.log(`Build selesai: ${files.length} file website. Tes, SQL, dokumen, dan tooling tidak disertakan.`);
