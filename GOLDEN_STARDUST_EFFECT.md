# ✨ Golden Stardust Cursor Effect

## Descripción

El cursor ahora deja un rastro elegante de **polvo de estrellas dorado** muy tenue. Es sofisticado, sutil y mágico. ✨

## 🌟 Características del Efecto

### 1. **Polvo Dorado Brillante**
- Partículas muy pequeñas (2-5px)
- Color: Oro suave (#FFD700)
- Muy tenue y elegante
- Brillo sutil (glow effect)

### 2. **Comportamiento Dinámico**
- Aparece al mover el cursor
- Más partículas cuando te mueves rápido
- Rotación suave 360°
- Parpadeo tipo estrella (twinkle)

### 3. **Efectos Especiales**

#### Al Mover el Cursor:
- 💫 Polvo dorado sigue tu movimiento
- ✨ Estrellas emoji aparecen ocasionalmente
- 🌟 Efecto muy sutil y elegante

#### Al Hacer Click:
- ⭐ Explosión de 12 partículas doradas
- ✨ 3 estrellas brillantes adicionales
- 💫 Patrón circular perfecto

## 🎨 Detalles Técnicos

### Colores Utilizados:
```css
Oro Brillante:     rgba(255, 215, 0, 0.8)
Oro Suave:         rgba(255, 223, 0, 0.4)
Brillo (Glow):     rgba(255, 215, 0, 0.6)
```

### Tamaños de Partículas:
- **Polvo regular:** 2-5px (muy pequeño)
- **Estrellas emoji:** 12px
- **Burst al click:** 3-5px

### Animaciones:
- **Twinkle (parpadeo):** 1.2s
- **Fade (desvanecimiento):** 1s
- **Rotation (rotación):** 2s continuo

## 🎯 Efectos Visuales

### Polvo de Estrellas:
```
Frecuencia:    30% de probabilidad por movimiento
Duración:      1.2 segundos
Animación:     Aparece → Brilla → Rota → Desaparece
Opacidad:      0 → 1 → 0.6 → 0
```

### Estrellas Emoji (✨):
```
Frecuencia:    5% de probabilidad (solo al mover rápido)
Duración:      1 segundo
Animación:     Flota hacia arriba mientras rota
Tamaño:        Crece de 0 → 1.5x
```

### Explosión al Click:
```
Partículas:    12 partículas + 3 estrellas
Patrón:        Circular 360°
Velocidad:     15-40px desde el centro
Efecto:        Burst mágico
```

## ✨ Efectos de Blending

Se usa `mix-blend-mode: screen` para:
- Efecto de luz brillante
- Las partículas se "suman" visualmente
- Parece más luminoso y mágico
- Se ve bien sobre cualquier fondo

## 🎛️ Personalización

### Cambiar el Color del Polvo:

Edita `src/styles/cursor-effects.css`:

```css
.cursor-stardust {
  background: radial-gradient(
    circle, 
    rgba(TU_R, TU_G, TU_B, 0.8) 0%, 
    rgba(TU_R, TU_G, TU_B, 0.4) 50%, 
    transparent 100%
  );
  box-shadow: 
    0 0 4px rgba(TU_R, TU_G, TU_B, 0.4),
    0 0 8px rgba(TU_R, TU_G, TU_B, 0.2);
}
```

### Ajustar la Cantidad de Polvo:

Edita `src/components/generic/CursorEffects.astro`:

```javascript
// Más polvo (más partículas)
const shouldCreateStardust = Math.random() > 0.5; // Era 0.7

// Menos polvo (más sutil)
const shouldCreateStardust = Math.random() > 0.85; // Más raro

// Para estrellas emoji
if (Math.random() > 0.90) { // Más frecuente (era 0.95)
  createStar(currentX, currentY);
}
```

### Cambiar Tamaño de Partículas:

```javascript
// Polvo más grande
const size = 4 + Math.random() * 6; // Era 2-5

// Polvo más pequeño (más sutil)
const size = 1 + Math.random() * 2; // Muy tenue
```

## 🌈 Sugerencias de Colores Alternativos

### Polvo Plateado (Silver):
```css
background: radial-gradient(circle, rgba(192, 192, 192, 0.8) 0%, transparent 100%);
box-shadow: 0 0 4px rgba(192, 192, 192, 0.4);
```

### Polvo Rosa (Rose Gold):
```css
background: radial-gradient(circle, rgba(255, 182, 193, 0.8) 0%, transparent 100%);
box-shadow: 0 0 4px rgba(255, 182, 193, 0.4);
```

### Polvo Azul Brillante:
```css
background: radial-gradient(circle, rgba(135, 206, 250, 0.8) 0%, transparent 100%);
box-shadow: 0 0 4px rgba(135, 206, 250, 0.4);
```

### Polvo Verde Esmeralda:
```css
background: radial-gradient(circle, rgba(80, 200, 120, 0.8) 0%, transparent 100%);
box-shadow: 0 0 4px rgba(80, 200, 120, 0.4);
```

## 📱 Rendimiento

### Optimizaciones Implementadas:
- ✅ Partículas se auto-eliminan (1-1.2s)
- ✅ Usa `requestAnimationFrame` (no necesario aquí, CSS animations)
- ✅ Desactivado en mobile automáticamente
- ✅ Probabilidad controlada (no crea demasiadas partículas)

### Rendimiento Esperado:
- **Desktop:** Suave 60fps
- **Laptop:** Suave 60fps
- **Mobile:** Desactivado (sin impacto)

## 🎨 Comparación: Antes vs Ahora

### Antes (Círculo Rojo):
- ❌ Círculo grande y visible
- ❌ Color rojo llamativo
- ❌ Siempre visible
- ❌ Menos elegante

### Ahora (Polvo Dorado):
- ✅ Partículas pequeñas y sutiles
- ✅ Oro elegante y sofisticado
- ✅ Aparece y desaparece suavemente
- ✅ Efecto mágico y premium

## 💡 Tips de Uso

1. **Mueve el cursor lentamente** → Polvo tenue y elegante
2. **Mueve el cursor rápido** → Más polvo + estrellas
3. **Haz click** → Explosión mágica de estrellas
4. **Sobre fondo oscuro** → El oro brilla más
5. **Sobre fondo claro** → Efecto más sutil pero visible

## 🎯 Casos de Uso Ideales

Este efecto es perfecto para:
- ✨ Portfolios creativos
- 🎨 Sitios de diseño
- 💎 Páginas premium/luxury
- 🌟 Landing pages especiales
- ✨ Sitios con temática mágica/elegante

## 🐛 Solución de Problemas

### No veo el polvo:
1. Mueve el cursor más rápido
2. Ajusta la probabilidad (ver Personalización)
3. Hard refresh: `Cmd/Ctrl + Shift + R`

### Demasiado polvo:
1. Reduce la probabilidad a 0.85 o más
2. Reduce el tamaño de partículas
3. Reduce la duración de la animación

### El polvo no se ve elegante:
1. Reduce el tamaño (1-3px)
2. Baja la opacidad inicial
3. Aumenta la probabilidad para más rareza

## 🚀 Estado Actual

✅ **Implementado y pusheado a GitHub**
- Commit: `b2cd66f Replace cursor follower with elegant golden stardust effect`
- El efecto está activo en tu sitio

## 📖 Archivos Modificados

```
src/
├── components/generic/CursorEffects.astro  (Lógica del polvo)
└── styles/cursor-effects.css               (Estilos y animaciones)
```

---

**Resultado:** Un efecto elegante, sutil y mágico que hace tu sitio único. ✨🌟💫

