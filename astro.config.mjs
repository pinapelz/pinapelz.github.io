import { defineConfig, sharpImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';


// https://astro.build/config
export default defineConfig({
  site: 'https://blog.pinapelz.com',
  integrations: [mdx(), sitemap(), react()],
  image:{
    service: sharpImageService(),
  }
});