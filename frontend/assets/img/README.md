# Assets - Recursos gráficos necesarios

Esta carpeta debe contener los siguientes recursos gráficos para que la aplicación funcione correctamente.

## Archivos requeridos

### 1. logo.png

**Uso**: Logo principal de JMI que aparece en las vistas de login y reset password

**Especificaciones**:

- Formato: PNG con transparencia
- Tamaño sugerido: 200-300px de ancho
- Fondo: Transparente
- Contenido: Logo de JMI

**Ubicación**: `client/assets/img/logo.png`

### 2. icon-192.png

**Uso**: Icono de la PWA para instalación en dispositivos (tamaño estándar)

**Especificaciones**:

- Formato: PNG
- Tamaño: 192x192 pixels
- Fondo: Puede ser transparente o del color corporativo
- Contenido: Versión simplificada del logo o icono específico de la app

**Ubicación**: `client/assets/img/icon-192.png`

### 3. icon-512.png

**Uso**: Icono de la PWA para instalación en dispositivos (tamaño grande)

**Especificaciones**:

- Formato: PNG
- Tamaño: 512x512 pixels
- Fondo: Igual que icon-192.png
- Contenido: Misma imagen que icon-192.png pero en mayor resolución

**Ubicación**: `client/assets/img/icon-512.png`

### 4. icons.svg ✅

**Estado**: Ya está creado

**Uso**: Sprite SVG con todos los iconos de la interfaz

Este archivo ya está implementado con los siguientes iconos:

- mail, lock, eye, chevron-down, plus, x
- clock, briefcase, map-pin, bar-chart, calendar
- check-circle, info-circle, warning, x-circle, check
- edit, trash, user, users, settings, log-out

## Creación de placeholders

Si no tienes los assets finales, puedes crear placeholders temporales:

### Placeholder para logo.png

Crea un archivo PNG de 300x100px con el texto "JMI TRACKER" en un editor gráfico o usa este código HTML para generarlo:

```html
<svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="100" fill="#1a73e8" />
  <text
    x="50%"
    y="50%"
    font-family="Arial"
    font-size="32"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    JMI TRACKER
  </text>
</svg>
```

Guarda esto como SVG y conviértelo a PNG, o usa una herramienta online.

### Placeholder para icon-192.png y icon-512.png

Crea cuadrados con las iniciales "JMI" centradas:

```html
<!-- Para 192x192 -->
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#1a73e8" rx="20" />
  <text
    x="50%"
    y="50%"
    font-family="Arial"
    font-size="80"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    JMI
  </text>
</svg>

<!-- Para 512x512 -->
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1a73e8" rx="50" />
  <text
    x="50%"
    y="50%"
    font-family="Arial"
    font-size="220"
    font-weight="bold"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    JMI
  </text>
</svg>
```

## Herramientas útiles

### Para convertir SVG a PNG

- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/es/svg-png/)
- Photoshop, GIMP, Inkscape (software de escritorio)

### Para redimensionar imágenes

- [iLoveIMG](https://www.iloveimg.com/es/redimensionar-imagen)
- [ResizeImage.net](https://resizeimage.net/)

### Para crear iconos PWA

- [PWA Asset Generator](https://www.pwabuilder.com/)
- [Favicon Generator](https://realfavicongenerator.net/)

## Notas importantes

1. Los iconos PWA deberían ser **cuadrados** (mismo ancho y alto)
2. Usa **colores corporativos** de JMI si están disponibles
3. Asegúrate de que los iconos sean **reconocibles** incluso en tamaños pequeños
4. El logo debería ser **legible** en fondos claros y oscuros
5. Para producción, optimiza las imágenes PNG (usa TinyPNG, ImageOptim, etc.)

## Verificación

Una vez añadidos los assets, verifica que:

- [ ] El logo aparece correctamente en la vista de login
- [ ] El logo aparece correctamente en la vista de reset password
- [ ] Los iconos PWA aparecen en el manifest inspector de Chrome DevTools
- [ ] La aplicación se puede instalar correctamente como PWA
- [ ] Los iconos se ven bien en la pantalla de inicio del dispositivo

## Alternativa temporal

Si no tienes los assets ahora, la aplicación funcionará igualmente pero mostrará:

- Imagen rota donde debería estar el logo
- Iconos por defecto del navegador en la instalación PWA

Puedes añadir los assets más tarde sin necesidad de modificar código.
