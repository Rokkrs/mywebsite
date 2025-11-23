# Cómo Actualizar los Posts de LinkedIn

## 📝 Limitaciones de LinkedIn

**Importante:** LinkedIn **NO permite** acceso automático a tu feed de actividad por políticas de privacidad. Por eso, debes actualizar tus posts destacados manualmente.

## 🎯 Lo Que He Creado

He creado una sección de **"LinkedIn Profile & Activity"** que muestra:

1. ✅ **Tu LinkedIn Profile Badge** - Se actualiza automáticamente
2. ✅ **Featured LinkedIn Posts** - Actualizas manualmente (explicación abajo)
3. ✅ **Botón directo a tu perfil** - Enlace a tu LinkedIn completo

## 🔄 Cómo Actualizar los Posts Manualmente

### Paso 1: Identifica tus Posts Importantes

1. Ve a tu perfil de LinkedIn: https://www.linkedin.com/in/oscar-cuadra-navarro-4bbb5743/
2. Busca los posts que quieres destacar (últimos posts, más populares, etc.)
3. Haz clic en el post para abrirlo
4. Copia la URL del post

### Paso 2: Edita el Archivo `index.astro`

Abre el archivo: `src/pages/index.astro`

Busca la sección donde dice:

```typescript
// LinkedIn Featured Posts - Update these manually with your real posts
const linkedInPosts = [
  {
    title: 'Building Native iOS Apps with SwiftUI',
    excerpt: 'Sharing my experience transitioning from UIKit to SwiftUI...',
    date: 'November 2024',
    url: 'https://www.linkedin.com/in/oscar-cuadra-navarro-4bbb5743/',
  },
  // Agrega más posts aquí
];
```

### Paso 3: Actualiza con tus Posts Reales

Reemplaza los posts de ejemplo con tus posts reales:

```typescript
const linkedInPosts = [
  {
    title: 'Título de tu Post en LinkedIn',
    excerpt: 'Un resumen corto de lo que trata el post (2-3 líneas)...',
    date: 'Mes Año', // Ej: 'Noviembre 2024'
    url: 'https://www.linkedin.com/posts/oscar-cuadra-navarro-tu-post-url',
    // image: '/images/post-thumbnail.jpg', // OPCIONAL: Si quieres agregar imagen
  },
  {
    title: 'Otro Post Importante',
    excerpt: 'Descripción del segundo post...',
    date: 'Octubre 2024',
    url: 'https://www.linkedin.com/posts/oscar-cuadra-navarro-otro-post',
  },
  // Puedes agregar más posts (recomiendo 2-4 posts)
];
```

### Paso 4: Agregar Imágenes (Opcional)

Si quieres agregar imágenes a tus posts:

1. Guarda la imagen en la carpeta `public/images/`
2. Agrega la ruta en el campo `image`:

```typescript
const linkedInPosts = [
  {
    title: 'Mi Post con Imagen',
    excerpt: 'Descripción...',
    date: 'Noviembre 2024',
    url: 'https://linkedin.com/posts/...',
    image: '/images/linkedin-post-1.jpg', // ← Agrega esta línea
  },
];
```

## 🚫 Opción: Sin Posts (Solo Profile Badge)

Si prefieres NO mostrar posts y solo mostrar el badge de LinkedIn con un call-to-action:

```typescript
const linkedInPosts = []; // ← Array vacío
```

Esto mostrará:
- Tu LinkedIn Profile Badge
- Un botón grande de "Follow on LinkedIn"

## 📋 Ejemplo Completo

```typescript
const linkedInPosts = [
  {
    title: 'Lanzamiento de mi nueva app iOS',
    excerpt: 'Después de 6 meses de desarrollo, finalmente lancé mi app de productividad en el App Store. Construida con SwiftUI, CoreData y Combine...',
    date: 'Diciembre 2024',
    url: 'https://www.linkedin.com/posts/oscar-cuadra-navarro-4bbb5743_ios-swift-appstore-activity-123456789',
    image: '/images/app-launch.jpg',
  },
  {
    title: 'SwiftUI vs UIKit: Mi Experiencia',
    excerpt: 'Después de trabajar con ambos frameworks, comparto mis insights sobre cuándo usar cada uno en proyectos de producción...',
    date: 'Noviembre 2024',
    url: 'https://www.linkedin.com/posts/oscar-cuadra-navarro-4bbb5743_swiftui-uikit-iosdevelopment-activity-987654321',
  },
  {
    title: 'Optimización de Performance en iOS',
    excerpt: 'Tips y técnicas que he usado para mejorar el rendimiento de apps iOS en producción, reduciendo el tiempo de carga en un 40%...',
    date: 'Octubre 2024',
    url: 'https://www.linkedin.com/posts/oscar-cuadra-navarro-4bbb5743_ios-performance-optimization-activity-456789123',
  },
];
```

## 🔄 Actualización Regular

**Frecuencia recomendada:** Actualiza tus posts destacados cada 1-2 meses

1. Cuando publiques un post importante en LinkedIn
2. Copia la URL del post
3. Actualiza el array `linkedInPosts` en `index.astro`
4. Commit y push a GitHub
5. Netlify desplegará automáticamente los cambios

## 💡 Tips

### ✅ Qué Posts Destacar:
- Posts sobre tus proyectos iOS
- Artículos técnicos que hayas escrito
- Logros profesionales (apps publicadas, certificaciones, etc.)
- Insights sobre desarrollo iOS
- Posts con buena interacción (likes, comments)

### ❌ Evita:
- Posts muy personales sin relación profesional
- Posts muy viejos (enfócate en los últimos 6-12 meses)
- Demasiados posts (2-4 es ideal)

## 🎨 Personalización Adicional

Si quieres cambiar el diseño de la sección, edita:
`src/components/generic/LinkedInActivity.astro`

Puedes modificar:
- Colores
- Tamaños de fuente
- Layout (grid, columns)
- Animaciones hover

## 🚀 Despliegue

Después de actualizar los posts:

```bash
git add src/pages/index.astro
git commit -m "Update LinkedIn featured posts"
git push origin main
```

Netlify desplegará automáticamente en 1-2 minutos.

## ❓ Preguntas Frecuentes

### ¿Por qué no se actualiza automáticamente?
LinkedIn no permite acceso a tu feed de actividad por API pública debido a políticas de privacidad.

### ¿Puedo usar un servicio de terceros?
Existen servicios pagos ($30-80/mes) como:
- EmbedSocial
- Taggbox
- Juicer.io

Pero la actualización manual es gratis y te da control total.

### ¿Qué pasa si no agrego posts?
El componente mostrará tu LinkedIn Badge y un botón de "Follow on LinkedIn".

### ¿Puedo agregar videos de LinkedIn?
No directamente en embed, pero puedes:
1. Subir el video a YouTube
2. Linkear al post de LinkedIn
3. Mencionar que es un video en el excerpt

## 📞 Soporte

Si necesitas ayuda, revisa:
- `LINKEDIN_EMBEDDING.md` - Explicación detallada de limitaciones
- `src/components/generic/LinkedInActivity.astro` - Código del componente

