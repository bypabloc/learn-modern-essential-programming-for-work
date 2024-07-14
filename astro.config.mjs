// astro.config.ts
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import mdx from "@astrojs/mdx";
import remarkToc from 'remark-toc';
import path from 'path';
// import rehypeMinifyHtml from 'rehype-minify-html';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS(), mdx({
    optimize: true,
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'dracula'
    },
    remarkPlugins: [remarkToc],
    // rehypePlugins: [rehypeMinifyHtml],
    remarkRehype: {
      footnoteLabel: 'Footnotes'
    },
    gfm: false
  }), vue()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@utils': path.resolve('./src/utils')
      }
    }
  }
});