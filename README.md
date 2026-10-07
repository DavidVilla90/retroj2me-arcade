# 📱 RetroJ2ME Arcade - Java Mobile Web Emulator

Arcade y biblioteca retro para jugar videojuegos clásicos **Java ME (J2ME / MIDlets .jar)** de teléfonos móviles Nokia, Sony Ericsson, Motorola y Siemens **directamente en el navegador web moderno**, sin plugins, sin extensiones y sin necesidad de instalar Java.

---

## 🚀 Características

- 🎮 **Emulación WebAssembly Nativa**: Ejecuta bytecode Java ME compilado al vuelo mediante CheerpJ 3.0 OpenJDK WASM y FreeJ2ME LCDUI core.
- 📱 **Chasis Telefónico Retro**: Carcasa táctil estilo Nokia N-Series con altavoz, pantalla LCD y teclado telefónico físico simulado.
- 📺 **Modos de Pantalla Proporcionales**: 1x (Original), 2x, 3x, 4x, Ajustar a Pantalla y Pantalla Completa nativa (sin deformación de aspecto).
- ⌨️ **Mapeo Completo de Teclado**: Asignación personalizada con detección de conflictos en tiempo real, perfiles Gamer (WASD+JK) y almacenamiento global o por juego en `localStorage`.
- 🕹️ **Teclado Táctil Virtual**: D-Pad direccional, teclas Softkey L/R y matriz numérica alfanumérica (1-9, *, 0, #) compatible con pantallas táctiles y móviles.
- 📦 **Cargador de .JAR Propios**: Arrastra y suelta cualquier juego `.jar` de tu colección para analizar su manifiesto y jugarlo al instante.
- 🕒 **Historial y Favoritos**: Registro automático de los últimos 5 juegos jugados y marcadores favoritos guardados localmente.
- 🔊 **Audio MIDI Integrado**: Sintetizador MIDI WebAssembly con control de volumen y silencio persistente.

---

## 🛠️ Tecnologías Utilizadas

- **React 19 & TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **CheerpJ 3.0 WebAssembly JVM**
- **FreeJ2ME Web Core**
- **Lucide Icons**

---

## 📦 Cómo ejecutar localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

Abre en tu navegador: `http://localhost:3000`

---

## 🌐 Publicar en GitHub y en Línea

Consulta la guía detallada en el repositorio o despliega directamente en:
- **GitHub Pages**: Activando *Settings > Pages > GitHub Actions*.
- **Vercel / Netlify**: Conectando tu repositorio de GitHub para despliegue automático.
