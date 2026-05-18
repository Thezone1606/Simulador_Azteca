# Viaje Azteca - Simulador

**Viaje Azteca** es un simulador web interactivo basado en el juego de mesa clásico. Permite a 2 a 6 jugadores competir recorriendo los estados de la República Mexicana, comprando propiedades, pagando rentas y administrando su dinero.

Este proyecto ha sido diseñado con un fuerte enfoque en la accesibilidad, incorporando **Síntesis de Voz (Text-to-Speech)** para narrar las jugadas, e interfaces responsivas para que se pueda disfrutar desde cualquier dispositivo móvil o computadora.

## 🚀 Características Principales

- **Gestión Automática del Banco:** El juego administra automáticamente el dinero inicial ($10,000 por jugador), las rentas, las compras y la recompensa al pasar por la Meta ($2,000).
- **Accesibilidad por Voz:** Cada acción (tirar los dados, comprar, estado del turno, etc.) es leída en voz alta. Ideal para jugadores con discapacidad visual.
- **Botón de Repetir e Inventario:** Los jugadores pueden solicitar en cualquier momento que se repita la información de su turno o escuchar el estado de sus propiedades y dinero.
- **Diseño Responsivo:** Interfaz amigable, botones grandes y adaptación perfecta a pantallas de celulares.
- **Vuelta de Gracia:** Las dos primeras vueltas de los jugadores son libres de compras y pagos para que puedan conocer el tablero.

## 🛠️ Tecnologías Usadas

- **HTML5:** Estructura de la aplicación.
- **CSS3:** Estilos, Flexbox y Media Queries para la adaptabilidad móvil.
- **JavaScript Vanilla:** Lógica del juego, manejo del estado de los jugadores y uso de la API nativa de `SpeechSynthesis` para la lectura en voz alta.

## 🎲 Cómo Jugar (Reglas Básicas)

1. Selecciona el número de jugadores (de 2 a 6) en la pantalla principal y presiona **Iniciar Juego**.
2. **Turnos iniciales:** Durante tus primeros 2 turnos (vuelta gratis) solo avanzarás para conocer el tablero. No podrás comprar.
3. **Comprar Propiedades:** A partir del tercer turno, si caes en un estado que no tiene dueño, podrás comprarlo.
4. **Pago de Rentas:** Si caes en un estado que le pertenece a otro jugador, se te cobrará automáticamente una renta (la mitad del costo de la propiedad).
5. **Bancarrota:** El juego lo pierde el jugador que se quede sin dinero suficiente para pagar sus obligaciones.

## 💻 Instalación y Ejecución Local

Dado que es un proyecto de frontend puro (HTML, CSS, JS), no requiere instalaciones complejas ni bases de datos.

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/viaje-azteca-juego.git
   ```
2. Abre la carpeta del proyecto.
3. Haz doble clic en el archivo `index.html` para abrirlo en tu navegador web de preferencia (Chrome, Edge, Firefox, Safari).

---
*Desarrollado para disfrutar en familia y amigos.*
