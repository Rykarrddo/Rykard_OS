import { defineConfig } from 'astro/config';

export default defineConfig({
  // Fuerza a Vite a permitir archivos de node_modules y de la raíz
  vite: {
    server: {
      fs: {
        allow: ['/home/rykardo/', './'] 
      },
      cors: true // Esto debería mitigar el bloqueo del cross-origin de la imagen
    }
  }
});
