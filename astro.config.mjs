// astro.config.ts
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import mdx from "@astrojs/mdx";
import remarkToc from 'remark-toc';
// import rehypeMinifyHtml from 'rehype-minify-html';

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS(), 
    mdx({
      optimize: true,
      syntaxHighlight: 'shiki',
      shikiConfig: { theme: 'dracula' },
      remarkPlugins: [remarkToc],
      // rehypePlugins: [rehypeMinifyHtml],
      remarkRehype: { footnoteLabel: 'Footnotes' },
      gfm: false,
    }),
  ],
});