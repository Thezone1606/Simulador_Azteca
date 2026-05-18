<div align="center">
  <h1>🇲🇽 Viaje Azteca - Simulador</h1>
  <p>Un simulador web interactivo e inclusivo basado en el juego de mesa clásico.</p>
  
  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  </p>

  <h3>
    <a href="https://Thezone1606.github.io/Simulador_Azteca/">🔴 JUGAR AHORA (En Vivo)</a>
  </h3>
</div>

<br>

## 📖 Acerca del Proyecto

**Viaje Azteca** es un simulador diseñado para que de 2 a 6 jugadores puedan competir recorriendo los estados de la República Mexicana. El sistema automatiza las tareas pesadas del juego de mesa original, como la administración de dinero, el cobro de rentas y la compra de propiedades.

Este proyecto ha sido desarrollado con un fuerte enfoque en la **accesibilidad** y la **movilidad**, permitiendo que cualquier persona (incluyendo aquellas con discapacidad visual) pueda disfrutar del juego gracias a su sistema de narración por voz y su diseño responsivo para celulares.

---

## ✨ Características Principales

- 🏦 **Banco Automatizado:** Olvídate de los billetes de papel. El juego administra tu dinero inicial ($10,000), el cobro de rentas y el pago de $2,000 al cruzar la Meta.
- 🗣️ **Accesibilidad por Voz (TTS):** Todas las acciones, resultados de los dados y notificaciones son leídas en voz alta usando la API nativa de *SpeechSynthesis*.
- 🎒 **Inventario Dinámico:** Consulta en cualquier momento tus propiedades adquiridas y tu saldo actual.
- 📱 **Diseño 100% Responsivo:** Interfaz adaptada para jugar cómodamente desde la pantalla de cualquier celular sin problemas de zoom o botones fuera de lugar.
- 🔄 **Modo Re-juego:** Botón de reinicio rápido para empezar una nueva partida conservando o cambiando la cantidad de jugadores.

---

## 📜 Reglas del Juego

1. **Preparación:** Selecciona de 2 a 6 jugadores.
2. **Vuelta de Gracia:** Durante tus **primeros 2 turnos**, el juego solo te permitirá avanzar y conocer el tablero. No podrás comprar nada.
3. **Compra de Estados:** A partir de tu tercer turno, si caes en un estado sin dueño, tendrás la opción de comprarlo.
4. **Pago de Rentas:** Si caes en un estado que le pertenece a otro jugador, el banco te descontará automáticamente la mitad del valor del estado y se lo dará al dueño.
5. **Venta rápida:** Tienes la opción de vender si necesitas dinero (recibes $500).
6. **Bancarrota:** El juego termina para el jugador que se quede sin fondos para pagar una renta.

---

## 💻 Instalación y Ejecución Local

Si deseas descargar el código y modificarlo localmente, no necesitas instalar bases de datos ni servidores complejos:

1. Clona este repositorio en tu computadora:
   ```bash
   git clone https://github.com/Thezone1606/Simulador_Azteca.git
   ```
2. Abre la carpeta del proyecto.
3. Haz doble clic en el archivo `index.html` para abrirlo en tu navegador de preferencia.
*(Nota: La síntesis de voz requiere que los altavoces de tu dispositivo estén activos).*

---
<div align="center">
  <i>Desarrollado para disfrutar en familia y acercar los juegos de mesa a la tecnología accesible.</i>
</div>
