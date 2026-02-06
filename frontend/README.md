# JMI Tracker - Cliente Web

Este es el cliente web de la aplicación JMI Tracker, una PWA (Progressive Web App) para el control horario de obras.

## Arquitectura

El cliente está construido con **vanilla JavaScript** sin frameworks externos, siguiendo una arquitectura **MV orientada a eventos**:

- **Estado centralizado** (`appState`): Clase que extiende `EventTarget` para gestionar todo el estado de la aplicación
- **Vistas desacopladas**: Las vistas solo se encargan del rendering y escuchan cambios en el estado
- **Controladores**: Orquestan la lógica de negocio, validan datos y actualizan el estado
- **Servicios**: Capa de abstracción para las llamadas a la API

## Estructura del proyecto

```
client/
├── index.html              # Punto de entrada HTML
├── manifest.json           # Manifest de la PWA
├── sw.js                   # Service Worker para funcionalidad offline
├── assets/
│   └── img/
│       ├── icons.svg       # Sprite de iconos SVG
│       ├── logo.png        # Logo de la aplicación
│       ├── icon-192.png    # Icono PWA 192x192
│       └── icon-512.png    # Icono PWA 512x512
└── src/
    ├── main.js             # Punto de entrada de la aplicación
    ├── components/         # Componentes UI reutilizables
    │   ├── base-component.js
    │   ├── input-with-icon.js
    │   ├── button.js
    │   ├── select-with-icon.js
    │   ├── time-picker.js
    │   ├── spinner.js
    │   └── message.js
    ├── controllers/        # Controladores de lógica
    │   ├── auth-controller.js
    │   └── time-control-controller.js
    ├── services/           # Servicios de API
    │   ├── api-service.js
    │   ├── auth-service.js
    │   ├── time-entries-service.js
    │   ├── companies-service.js
    │   ├── resources-service.js
    │   ├── work-sites-service.js
    │   ├── work-rules-service.js
    │   ├── contractors-service.js
    │   ├── attendance-service.js
    │   └── categories-service.js
    ├── state/              # Gestión de estado
    │   └── app-state.js
    ├── styles/             # Estilos CSS
    │   ├── main.css
    │   ├── reset.css
    │   ├── variables.css
    │   ├── components.css
    │   ├── views.css
    │   └── animations.css
    ├── utils/              # Utilidades
    │   ├── config.js
    │   ├── date-utils.js
    │   ├── storage.js
    │   └── dom.js
    └── views/              # Vistas de la aplicación
        ├── base-view.js
        ├── login-view.js
        ├── reset-password-view.js
        └── time-control-view.js
```

## Instalación

1. El cliente es una aplicación estática que debe servirse desde un servidor web.

2. Asegúrate de que el backend esté corriendo en `http://localhost:3000` o modifica la URL en `src/utils/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

3. Sirve la carpeta `client/` con cualquier servidor HTTP estático:

```bash
# Opción 1: Con Python
python -m http.server 8080

# Opción 2: Con Node.js (http-server)
npx http-server -p 8080

# Opción 3: Con PHP
php -S localhost:8080
```

4. Abre el navegador en `http://localhost:8080`

## Desarrollo

### Convenciones de código

- **Idioma**: Todo el código (variables, funciones, comentarios) está en **inglés**
- **UI/UX**: Todos los textos visibles para el usuario están en **español**
- **Clases**: Para estilos, estados de apariencia e UI
- **IDs**: Para selección individual de elementos en el DOM y event listeners

### Componentes

Los componentes son clases que heredan de `BaseComponent` y se renderizan en un contenedor:

```javascript
import { InputWithIcon } from './components/input-with-icon.js';

const emailInput = new InputWithIcon(container, {
  type: 'email',
  placeholder: 'Correo electrónico',
  leftIcon: 'mail',
  onChange: value => console.log(value),
});
emailInput.render();
```

### Estado

El estado centralizado se gestiona a través de `appState`:

```javascript
import { appState } from './state/app-state.js';

// Escuchar cambios
appState.addEventListener('statechange', event => {
  console.log('State changed:', event.detail);
});

// Actualizar estado
appState.setSelectedWorkSite(workSite);

// Leer estado
const currentUser = appState.state.currentUser;
```

### Navegación

La navegación se realiza a través del estado, no con rutas:

```javascript
appState.navigateTo(VIEWS.TIME_CONTROL);
```

## Tareas pendientes (TODOs)

### Backend API

Algunas funcionalidades del cliente requieren ajustes en la API del backend:

1. **Time Entries Service**: La API necesita soportar filtros por `workSiteId` y `workDate`:

   ```javascript
   // TODO: API should support these query parameters
   GET /api/v1/time-entries?workSiteId=xxx&workDate=2026-02-06
   ```

2. **Attendance Service**: Similar, necesita filtros:
   ```javascript
   // TODO: API should support these query parameters
   GET /api/v1/attendance?workSiteId=xxx&workDate=2026-02-06
   ```

### Vistas por completar

1. **Vista de Empresas** (Companies View)
2. **Vista de Obras** (Work Sites View)
3. **Vista de Estadísticas** (Statistics View)
4. **Forgot Password View**

### Funcionalidades por implementar

1. **Time Control View**:
   - Renderizado completo de filas de time entries
   - Formulario para crear/editar time entries
   - Lógica para empresa principal (horarios automáticos)
   - Renderizado completo de filas de asistencia
   - Formulario para crear/editar asistencia

2. **Notificaciones**: Sistema de notificaciones toast

3. **Offline mode**: Mejorar el service worker para caché de datos

## Assets necesarios

Para que la aplicación funcione completamente, necesitas añadir estos archivos en `assets/img/`:

- `logo.png` - Logo de JMI
- `icon-192.png` - Icono de la PWA 192x192px
- `icon-512.png` - Icono de la PWA 512x512px

## Características de la PWA

- **Instalable**: Puede instalarse como una app nativa
- **Responsive**: Se adapta a móvil, tablet y desktop
- **Offline**: Service worker para funcionalidad básica offline
- **Fast**: Sin dependencias pesadas, vanilla JS puro

## Notas de implementación

1. Los componentes usan **Shadow DOM** implícito (no web components nativos)
2. Las clases se usan extensivamente para herencia y reutilización
3. Los event listeners se rastrean y limpian automáticamente
4. El estado es inmutable a nivel de referencia (se crean nuevos objetos al actualizar)
5. Las animaciones y transiciones están en CSS puro

## Soporte de navegadores

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Navegadores móviles modernos

## Licencia

© 2026 Kuantik Software
