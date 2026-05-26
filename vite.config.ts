import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { htmlFiles } from './getHTMLFileNames';
import {
  run as runWebpConversion,
  startWatch as startWebpWatch,
} from './scripts/convertToWebp';

type PictureSource = {
  media?: string;
  srcset?: string;
  src?: string;
  type?: string;
};

type PictureHelperHash = {
  alt?: string;
  class?: string;
  loading?: string;
  width?: number | string;
  height?: number | string;
  sources?: PictureSource[];
};

type PictureHelperOptions = {
  hash?: PictureHelperHash;
};

function pictureHelper(pathOrSrc: unknown, options: PictureHelperOptions = {}): string {
  const src = typeof pathOrSrc === 'string' ? pathOrSrc : '';
  const hash = options.hash || {};
  const alt = hash.alt != null ? String(hash.alt) : '';
  const className = hash.class != null ? ` class="${String(hash.class)}"` : '';
  const loading = hash.loading != null ? String(hash.loading) : 'lazy';
  const width =
    hash.width != null ? ` width="${Number(hash.width)}"` : '';
  const height =
    hash.height != null ? ` height="${Number(hash.height)}"` : '';
  const sources = hash.sources || [];

  const normalized = src.replace(/^\//, '');
  const imgPath = normalized;
  const webpPath = normalized.replace(/\.(png|jpe?g)$/i, '.webp');

  let sourcesHtml = '';

  if (Array.isArray(sources) && sources.length > 0) {
    sources.forEach((source) => {
      if (source && typeof source === 'object') {
        const media = source.media
          ? ` media="${String(source.media).replace(/"/g, '&quot;')}"`
          : '';
        const srcset = source.srcset || source.src || '';
        const type = source.type
          ? ` type="${String(source.type).replace(/"/g, '&quot;')}"`
          : '';

        if (srcset) {
          const normalizedSrcset = srcset.replace(/^\//, '');
          sourcesHtml += `<source${media} srcset="${normalizedSrcset}"${type}>`;
        }
      }
    });
  }

  return (
    `<picture${className}>` +
    sourcesHtml +
    `<source srcset="${webpPath}" type="image/webp">` +
    `<img src="${imgPath}" alt="${alt.replace(
      /"/g,
      '&quot;',
    )}" loading="${loading}"${width}${height}>` +
    `</picture>`
  );
}

const input: Record<string, string> = {
  main: resolve(__dirname, 'src/index.html'),
};

htmlFiles.forEach((file) => {
  input[file.replace('.html', '')] = resolve(__dirname, 'src', file);
});

const webpPlugin = () => {
  return {
    name: 'webp-convert',
    async buildStart() {
      await runWebpConversion();
    },
    configureServer() {
      startWebpWatch();
    },
  };
};

const handlebarsReloadPlugin = () => {
  return {
    name: 'handlebars-reload',
    handleHotUpdate({ file, server }: { file: string; server: any }) {
      const normalizedPath = file.replace(/\\/g, '/');

      if (
        normalizedPath.includes('/templates/') ||
        normalizedPath.includes('/sections/')
      ) {
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
        return [];
      }

      return [];
    },
    configureServer(server: any) {
      const templatesDir = resolve(__dirname, 'src/templates');
      const sectionsDir = resolve(__dirname, 'src/sections');

      server.watcher.add([templatesDir, sectionsDir]);
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const enableWebpConvert = env.VITE_WEBP_CONVERT !== 'false';

  return {
    base: './',
    root: 'src',
    publicDir: '../public',
    plugins: [
      handlebars({
        partialDirectory: [
          resolve(__dirname, 'src/templates'),
          resolve(__dirname, 'src/sections'),
        ],
        reloadOnPartialChange: true,
        helpers: {
          picture: pictureHelper,
          array: function (...args: unknown[]) {
            const items = args.slice(0, -1);
            return items;
          },
          object: function (...args: unknown[]) {
            const options = args[args.length - 1] as { hash?: Record<string, unknown> };
            return options.hash || {};
          },
        },
      }),
      handlebarsReloadPlugin(),
      ...(enableWebpConvert ? [webpPlugin()] : []),
    ],
    build: {
      rollupOptions: {
        input,
      },
      outDir: '../dist/',
      emptyOutDir: true,
    },
    server: {
      host: true,
      open: true,
    },
  };
});

