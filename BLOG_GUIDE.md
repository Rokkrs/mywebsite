# 📚 Guía del Blog

## Estructura del Blog

Tu sitio ahora tiene un blog completo donde puedes compartir posts, ideas, recomendaciones de libros y más.

### 📁 Archivos Creados

```
src/
├── content.config.ts              # Configuración de colecciones
├── data/
│   └── blog/                      # Aquí van tus posts
│       ├── primer-post.md
│       ├── swiftui-tips.md
│       └── libros-recomendados.md
└── pages/
    └── blog/
        ├── index.astro            # Página principal del blog
        └── [...slug].astro        # Páginas individuales de posts
```

## 🆕 Cómo Crear un Nuevo Post

### 1. Crea un Archivo Markdown

Crea un nuevo archivo en `src/data/blog/nombre-del-post.md`

### 2. Agrega el Frontmatter

Cada post debe empezar con metadatos YAML:

```markdown
---
title: 'Título de tu Post'
description: 'Descripción corta que aparecerá en la lista de posts'
pubDate: 2024-11-23
author: 'Oscar Cuadra'
tags: ['Tag1', 'Tag2', 'Tag3']
draft: false
image: '/ruta/a/imagen.jpg'  # Opcional
---

## Tu contenido aquí

Escribe tu post usando Markdown...
```

### 3. Escribe el Contenido

Usa Markdown normal:

```markdown
## Título Principal

Párrafo de texto normal.

### Subtítulo

- Lista item 1
- Lista item 2

1. Lista numerada
2. Segundo item

**Texto en negrita**
*Texto en itálica*

[Link a sitio](https://ejemplo.com)

![Imagen](ruta/a/imagen.jpg)

> Cita o blockquote

`código inline`

\`\`\`swift
// Bloque de código
func hola() {
    print("Hola mundo")
}
\`\`\`
```

## 🏷️ Campos del Frontmatter

### Campos Obligatorios:

- **title**: Título del post
- **description**: Descripción breve (aparece en listado)
- **pubDate**: Fecha de publicación (formato: YYYY-MM-DD)

### Campos Opcionales:

- **author**: Nombre del autor (default: 'Oscar Cuadra')
- **tags**: Array de categorías `['iOS', 'Swift', 'Tutorial']`
- **draft**: `true` para ocultar el post, `false` para publicarlo
- **image**: Ruta a imagen destacada (puede estar en `/public/images/`)

## 📝 Ejemplos de Posts

### Post Simple

```markdown
---
title: 'Mi Primer Post'
description: 'Una introducción a mi blog'
pubDate: 2024-11-23
tags: ['General']
---

## Hola

Este es mi primer post. ¡Bienvenidos!
```

### Post con Código

```markdown
---
title: 'Tutorial de Swift'
description: 'Aprende Swift desde cero'
pubDate: 2024-11-23
tags: ['Swift', 'Tutorial', 'iOS']
---

## Introducción

Vamos a aprender Swift...

\`\`\`swift
let nombre = "Oscar"
print("Hola, \(nombre)")
\`\`\`
```

### Post de Libro

```markdown
---
title: 'Review: Clean Code'
description: 'Mi opinión sobre este libro clásico'
pubDate: 2024-11-23
tags: ['Libros', 'Recomendaciones']
image: '/images/clean-code.jpg'
---

## ¿Por qué leerlo?

Clean Code es esencial porque...

### Mi Calificación: ⭐⭐⭐⭐⭐

Lo recomiendo por...
```

## 🎨 Tags Sugeridos

Usa tags consistentes para organizar tu contenido:

### Desarrollo:
- `iOS`
- `Swift`
- `SwiftUI`
- `UIKit`
- `Xcode`
- `Tutorial`
- `Código`

### Aprendizaje:
- `Libros`
- `Recomendaciones`
- `Desarrollo Personal`
- `Productividad`
- `Aprendizaje`

### Categorías:
- `General`
- `Reflexión`
- `Opinión`
- `Noticias`
- `Proyecto`

## 🖼️ Agregar Imágenes

### 1. Guarda la Imagen

Crea la carpeta y guarda tus imágenes:

```bash
mkdir -p public/images/blog
```

Guarda imágenes en: `public/images/blog/nombre-imagen.jpg`

### 2. Referencia en el Post

**Imagen destacada (frontmatter):**
```yaml
---
image: '/images/blog/mi-imagen.jpg'
---
```

**Imagen en el contenido:**
```markdown
![Descripción de la imagen](/images/blog/mi-imagen.jpg)
```

## 📤 Publicar un Post

### Guardar como Borrador

```yaml
---
draft: true
---
```

El post NO aparecerá en el blog.

### Publicar

```yaml
---
draft: false
---
```

El post aparecerá en el blog.

## 🚀 Workflow Completo

### 1. Crear el Post

```bash
# Crear nuevo archivo
touch src/data/blog/mi-nuevo-post.md
```

### 2. Escribir el Contenido

Edita el archivo con tu editor favorito.

### 3. Vista Previa Local

```bash
pnpm dev
```

Visita: `http://localhost:4321/blog`

### 4. Publicar

```bash
git add src/data/blog/mi-nuevo-post.md
git commit -m "Add new blog post: Mi Nuevo Post"
git push origin main
```

Netlify desplegará automáticamente.

## 🎯 URLs del Blog

- **Página principal:** `/blog`
- **Post individual:** `/blog/nombre-del-archivo` (sin .md)

Ejemplo:
- Archivo: `src/data/blog/swiftui-tips.md`
- URL: `https://tu-sitio.com/blog/swiftui-tips`

## ✍️ Tips de Escritura

### 1. Títulos Atractivos

❌ Malo: "Post sobre Swift"
✅ Bueno: "5 Tips de Swift que Mejorarán tu Código"

### 2. Descripciones Claras

La descripción aparece en el listado:

❌ Malo: "Un post"
✅ Bueno: "Aprende 5 técnicas avanzadas de Swift con ejemplos prácticos"

### 3. Usa Código

Los desarrolladores aman ver código:

```swift
// Siempre explica el código
struct MiVista: View {
    var body: some View {
        Text("Hola")
    }
}
```

### 4. Estructura Clara

Usa headers (##, ###) para organizar:

```markdown
## Introducción
## Problema
## Solución
## Código
## Conclusión
```

### 5. Call to Action

Termina invitando a la interacción:

```markdown
¿Qué te pareció? ¡Conéctate conmigo en LinkedIn!
```

## 🎨 Personalización

### Cambiar Estilos

Los estilos del blog están en:
- `src/pages/blog/index.astro` (lista)
- `src/pages/blog/[...slug].astro` (post individual)

### Modificar Formato de Fecha

En ambos archivos, busca `formatDate`:

```javascript
// Cambiar de español a inglés
return new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(date);
```

## 📊 Ordenamiento

Los posts se ordenan por fecha (más reciente primero) automáticamente.

## 🔍 Buscar Posts

Actualmente no hay búsqueda, pero puedes:
1. Filtrar por tags (ya implementado visualmente)
2. Agregar búsqueda (futuro)

## 💡 Ideas de Contenido

### Posts Técnicos:
- Tutoriales de Swift/SwiftUI
- Soluciones a problemas comunes
- Review de herramientas
- Patrones de diseño

### Posts de Libros:
- Reviews de libros técnicos
- Resúmenes de libros
- Listas de recomendaciones
- Cómo aplicar conceptos

### Posts Personales:
- Tu journey como developer
- Lecciones aprendidas
- Proyectos personales
- Reflexiones de carrera

## 🐛 Troubleshooting

### Post no aparece:

1. ¿`draft: false`?
2. ¿Fecha correcta? (YYYY-MM-DD)
3. ¿Sintaxis YAML correcta? (3 guiones ---)
4. ¿Archivo en `src/data/blog/`?

### Imágenes no se ven:

1. ¿Imagen en `/public/images/`?
2. ¿Ruta empieza con `/`? (`/images/foto.jpg`)
3. ¿Nombre correcto? (case-sensitive)

### Errores de build:

```bash
# Limpia y reconstruye
rm -rf .astro dist
pnpm build
```

---

¡Feliz blogging! 🚀📝

