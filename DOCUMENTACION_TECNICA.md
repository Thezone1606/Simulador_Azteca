# ⚙️ Documentación Técnica - Viaje Azteca

Este documento detalla la arquitectura, lógica de programación y funcionamiento interno del simulador web **Viaje Azteca**.

## 1. Arquitectura del Proyecto
El proyecto está desarrollado utilizando un stack frontend puro sin dependencias externas ni frameworks de terceros.
- **Estructura del DOM:** `index.html`
- **Diseño y Estilización:** `style.css`
- **Lógica de Estado e Interactividad:** `script.js`

## 2. Lógica Central (`script.js`)

### Estructuras de Datos Principales
- `estadosRepublica`: Un arreglo de cadenas que contiene los 32 estados de la República Mexicana.
- `casillas`: Un arreglo que une la casilla "Meta" al inicio y desglosa los 32 estados. Total = 33 posiciones (0 a 32).
- `jugadores`: Un arreglo dinámico de objetos. Cada objeto representa un jugador y almacena su estado actual:
  ```javascript
  {
      id: 1,              // Identificador numérico
      posicion: 0,        // Índice actual en el arreglo 'casillas'
      turnosJugados: 0,   // Contador para validar la 'vuelta de gracia'
      dinero: 10000,      // Saldo inicial por defecto
      propiedades: []     // Lista de strings con los estados comprados
  }
  ```
- `propietarios`: Un arreglo de longitud 33 iniciado en `null`. Mapea qué jugador (por su ID) es dueño de qué índice del tablero.

### Ciclo de Vida del Turno
El flujo de un turno está gobernado por funciones encadenadas:
1. `tirarDado()`: Genera un número aleatorio del 1 al 6 usando `Math.random()`. Actualiza la `posicion` del jugador.
2. **Cálculo de Casilla:** 
   - La posición se reinicia si supera el 32 usando el módulo: `nuevaPosicion % casillas.length`.
   - Se otorgan `$2000` si pasa por la meta (`index 0`).
   - El precio de compra se calcula dinámicamente con la fórmula: `(index * 100) + 1000`.
3. **Validación de Reglas:** Evalúa si el jugador está en sus primeros 2 turnos (vuelta gratis), si la casilla tiene dueño, o si es la Meta.
4. `pasarTurno()` / `finalizarTurno()`: Rota el `jugadorActualIndex` y actualiza la interfaz para el siguiente jugador.

### Accesibilidad (Web Speech API)
La narración en voz alta se maneja a través de la interfaz nativa `SpeechSynthesisUtterance`.
- **Función `hablar(texto, cancelarAnterior, callbackEnd)`:**
  Recibe el texto a narrar. Cancela cualquier locución previa si se requiere y dispara la voz en español (`es-MX`).
  **Manejo de asincronía y fallos móviles:** Implementa un `setTimeout` de seguridad que estima el tiempo de lectura basándose en la longitud del texto. Esto previene un error crítico en iOS/Android donde el evento `.onend` no se dispara, bloqueando el estado del juego.

## 3. Accesibilidad y Responsividad (CSS)
El diseño garantiza compatibilidad móvil usando un esquema general `box-sizing: border-box;`.
Mediante Media Queries (`@media (max-width: 600px)`), se asegura que el panel de control (`.botones`) cambie su comportamiento a `flex-direction: column`, ocupando el ancho completo de la pantalla para evitar desbordamientos horizontales. La propiedad `touch-action: manipulation` elimina la latencia de 300ms en dispositivos táctiles.
