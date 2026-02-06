# Guía de Inicio Rápido - JMI Tracker Cliente

Esta guía te ayudará a poner en marcha el cliente de JMI Tracker en pocos minutos.

## Paso 1: Verificar que tienes todo

Asegúrate de que la estructura de carpetas sea la siguiente:

```
client/
├── index.html
├── manifest.json
├── sw.js
├── assets/
│   └── img/
│       ├── icons.svg ✅
│       ├── logo.svg ✅
│       ├── icon-192.svg ✅
│       └── icon-512.svg ✅
└── src/
    ├── main.js ✅
    ├── components/ ✅
    ├── controllers/ ✅
    ├── services/ ✅
    ├── state/ ✅
    ├── styles/ ✅
    ├── utils/ ✅
    └── views/ ✅
```

Los archivos marcados con ✅ deberían estar presentes.

## Paso 2: Configurar la URL del backend

1. Abre el archivo `src/utils/config.js`
2. Verifica o modifica la URL del backend:

```javascript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

Si tu backend está en otra dirección, cámbiala aquí.

## Paso 3: Iniciar un servidor web

El cliente es una aplicación estática, necesitas servirla con un servidor HTTP. Elige una de estas opciones:

### Opción A: Con Python (si lo tienes instalado)

```bash
# Navega a la carpeta client/
cd client

# Python 3
python -m http.server 8080

# O Python 2
python -m SimpleHTTPServer 8080
```

### Opción B: Con Node.js

```bash
# Instalar http-server globalmente (solo la primera vez)
npm install -g http-server

# Navega a la carpeta client/
cd client

# Iniciar servidor
http-server -p 8080
```

### Opción C: Con PHP

```bash
# Navega a la carpeta client/
cd client

# Iniciar servidor
php -S localhost:8080
```

### Opción D: Con VS Code (extensión Live Server)

1. Instala la extensión "Live Server" en VS Code
2. Abre la carpeta `client/` en VS Code
3. Haz clic derecho en `index.html`
4. Selecciona "Open with Live Server"

## Paso 4: Abrir la aplicación

Abre tu navegador en:

```
http://localhost:8080
```

Deberías ver la pantalla de login de JMI Tracker.

## Paso 5: Verificar que funciona

### Verificación básica

- ✅ La página carga sin errores en la consola
- ✅ Se muestra el logo "JMI TRACKER"
- ✅ Hay dos campos de entrada (email y contraseña)
- ✅ Hay un botón "Iniciar sesión"
- ✅ Hay un enlace "¿Olvidaste tu contraseña?"

### Verificar en la consola del navegador

Abre las DevTools (F12) y en la consola escribe:

```javascript
appState.getState();
```

Deberías ver el estado inicial de la aplicación.

### Verificar PWA

1. Abre las DevTools (F12)
2. Ve a la pestaña "Application" (Chrome) o "Almacenamiento" (Firefox)
3. En el menú lateral, busca "Manifest"
4. Deberías ver los detalles de la PWA:
   - Nombre: JMI Tracker
   - Iconos: 192x192 y 512x512

## Problemas comunes

### Error: "Service Worker failed to register"

**Solución**: Los Service Workers solo funcionan en HTTPS o en localhost. Asegúrate de estar usando `localhost` y no una IP local.

### Error: "Failed to fetch"

**Solución**:

1. Verifica que el backend esté corriendo
2. Verifica la URL en `src/utils/config.js`
3. Verifica que no haya problemas de CORS en el backend

### Las imágenes no cargan

**Solución**: Verifica que los archivos SVG existan en `client/assets/img/`

### Los estilos no se aplican

**Solución**:

1. Verifica que todos los archivos CSS existan en `src/styles/`
2. Revisa la consola para ver si hay errores de carga
3. Verifica que el `main.css` importe correctamente todos los demás archivos CSS

## Testing básico

### Probar la navegación

Aunque no funcione el login (si el backend no está disponible), puedes probar el sistema de navegación en la consola:

```javascript
// Navegar a reset password
appState.navigateTo('reset-password', { code: '123456' });

// Volver a login
appState.navigateTo('login');

// Simular autenticación
appState.setAuth('fake-token', {
  id: '1',
  email: 'test@test.com',
  role: 'user',
});

// Navegar a time control
appState.navigateTo('time-control');
```

### Probar componentes

Puedes crear componentes dinámicamente en la consola:

```javascript
// Crear un botón
import { Button } from './src/components/button.js';
const btn = new Button(document.body, {
  text: 'Test Button',
  onClick: () => alert('Clicked!'),
});
btn.render();
```

## Siguientes pasos

Una vez que la aplicación esté funcionando:

1. **Conectar con el backend**: Asegúrate de que el backend esté corriendo y responda correctamente
2. **Probar el login**: Intenta iniciar sesión con credenciales válidas
3. **Explorar las vistas**: Navega por las diferentes secciones de la aplicación
4. **Personalizar assets**: Reemplaza los logos SVG placeholder con los logos reales de JMI

## Recursos adicionales

- [README completo](./README.md)
- [Notas de implementación](./IMPLEMENTATION_NOTES.md)
- [Documentación de assets](./assets/img/README.md)

## Ayuda

Si encuentras problemas:

1. Revisa la consola del navegador (F12) en busca de errores
2. Verifica que todos los archivos necesarios existan
3. Asegúrate de que el servidor web esté sirviendo desde la carpeta correcta
4. Verifica la configuración de la URL del backend

---

**¿Todo funcionando?** ¡Perfecto! Ya puedes empezar a usar o desarrollar JMI Tracker.
