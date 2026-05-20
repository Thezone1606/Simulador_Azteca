// script.js
(() => { // Encapsulamiento IIFE para evitar trampas desde la consola
const estadosRepublica = [
    // NORTE (10 casillas)
    "Beneficio", "Baja California", "Baja California Sur", "Sonora", "Chihuahua", "Beneficio", "Coahuila", "Nuevo León", "Tamaulipas", "Durango",
    // OESTE (10 casillas)
    "Sinaloa", "Beneficio", "Nayarit", "Jalisco", "Colima", "Cárcel", "Michoacán", "Aguascalientes", "Guanajuato", "Zacatecas",
    // CENTRO/ESTE (11 casillas)
    "San Luis Potosí", "Beneficio", "Querétaro", "Hidalgo", "Estado de México", "Beneficio", "Ciudad de México", "Tlaxcala", "Puebla", "Beneficio", "Morelos",
    // SUR (11 casillas)
    "Veracruz", "Guerrero", "Beneficio", "Oaxaca", "Chiapas", "Cárcel", "Tabasco", "Campeche", "Beneficio", "Yucatán", "Quintana Roo"
];

// Función para determinar la zona según el índice en 'casillas'
function obtenerZona(index) {
    if (index === 0) return "";
    if (index >= 1 && index <= 10) return "Zona Norte";
    if (index >= 11 && index <= 20) return "Zona Oeste";
    if (index >= 21 && index <= 31) return "Zona Centro-Este";
    if (index >= 32 && index <= 42) return "Zona Sur";
    return "";
}

const casillas = ["Meta", ...estadosRepublica];
let numJugadores = 2;
let esExperimentado = false;
let jugadores = [];
let jugadorActualIndex = 0;
let yaTiro = false;
let timeoutTurno = null; // Para el auto-pass en vuelta 2

const costoCasilla = (index) => {
    if (index === 0) return 0;
    const nombre = casillas[index];
    if (nombre === "Beneficio" || nombre === "Cárcel") return 0;
    return (index * 100) + 1000;
};
let propietarios = []; // Almacena el id del dueño de cada casilla

let btnTirar, btnComprar, btnRepetir, btnInventario, btnReiniciar, indicadorTurno, resultadoDado, registro;

document.addEventListener("DOMContentLoaded", () => {
    btnTirar = document.getElementById('btn-tirar');
    btnComprar = document.getElementById('btn-comprar');
    btnRepetir = document.getElementById('btn-repetir');
    btnInventario = document.getElementById('btn-inventario');
    btnReiniciar = document.getElementById('btn-reiniciar');
    indicadorTurno = document.getElementById('indicador-turno');
    resultadoDado = document.getElementById('resultado-dado');
    registro = document.getElementById('registro-acciones');
});

function iniciarJuego() {
    let input = document.getElementById('num-jugadores').value;
    numJugadores = parseInt(input);
    if(isNaN(numJugadores) || numJugadores < 2 || numJugadores > 6) {
        alert("El número de jugadores debe ser entre 2 y 6.");
        return;
    }
    
    let expInput = document.getElementById('nivel-experiencia').value;
    esExperimentado = (expInput === 'experimentado');

    jugadores = [];
    for(let i = 0; i < numJugadores; i++) {
        jugadores.push({ id: i+1, posicion: 0, turnosJugados: 0, vueltas: 0, dinero: 10000, propiedades: [], cayoEnEspecial: false });
    }
    propietarios = new Array(casillas.length).fill(null);
    jugadorActualIndex = 0;
    yaTiro = false;
    
    document.getElementById('configuracion').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    
    actualizarInterfaz();
    
    let mensajeInicio = 'El juego ha comenzado. Todos los jugadores están en la Meta.';
    let mensajeVoz = 'El juego ha comenzado. Todos los jugadores están en la Meta.';
    
    if (esExperimentado) {
        mensajeInicio = 'El juego ha comenzado en Modo Experimentado. Un gusto tenerte de nueva cuenta aquí, diviértete, experimenta y confía en tus sentidos.';
        mensajeVoz = 'Un gusto tenerte de nueva cuenta aquí, diviértete, experimenta y confía en tus sentidos. El juego ha comenzado en Modo Experimentado. Todos los jugadores están en la Meta y pueden comprar desde su primer turno.';
    } else {
        mensajeInicio = 'El juego ha comenzado en Modo Principiante. Todos los jugadores están en la Meta.';
        mensajeVoz = 'El juego ha comenzado en Modo Principiante. Todos los jugadores están en la Meta. Recuerden que en sus primeros dos turnos solo recorrerán el tablero.';
    }
    
    reiniciarRegistro(mensajeInicio);
    hablar(mensajeVoz);
}

function actualizarInterfaz() {
    const j = jugadores[jugadorActualIndex];
    indicadorTurno.innerText = `Turno del Jugador ${j.id} | Dinero: $${j.dinero}`;
    btnTirar.disabled = false;
    btnComprar.disabled = true;
    btnRepetir.disabled = true;
    btnInventario.disabled = (j.propiedades.length === 0);
    resultadoDado.textContent = "🎲"; // Uso seguro de textContent en lugar de innerHTML
}

function hablar(texto, cancelarAnterior = true, callbackEnd = null) {
    if ('speechSynthesis' in window) {
        if (cancelarAnterior) window.speechSynthesis.cancel();
        const mensaje = new SpeechSynthesisUtterance(texto);
        mensaje.lang = 'es-MX';
        
        let completado = false;
        const finalizar = () => {
            if (!completado) {
                completado = true;
                if (callbackEnd) callbackEnd();
            }
        };

        mensaje.onend = finalizar;
        mensaje.onerror = finalizar;

        window.speechSynthesis.speak(mensaje);
        
        // Timeout de seguridad por si onend no se dispara (común en algunos móviles)
        // Estimamos el tiempo base al largo del texto (~100ms por letra aprox)
        const tiempoEstimado = texto.length * 100 + 2000; 
        setTimeout(finalizar, tiempoEstimado);

    } else if (callbackEnd) {
        // Fallback si no hay soporte de voz
        setTimeout(callbackEnd, 3000);
    }
}

function accionBoton(boton) {
    if (timeoutTurno) clearTimeout(timeoutTurno); // Cancelar auto-pass al interactuar

    const j = jugadores[jugadorActualIndex];
    hablar(`Botón ${boton} tocado.`, true);

    if (boton === 'Tirar') {
        tirarDado();
    } else if (boton === 'Comprar') {
        comprarPropiedad();
    } else if (boton === 'Repetir') {
        repetirTurno();
    } else if (boton === 'Inventario') {
        escucharInventario();
    } else if (boton === 'Reiniciar') {
        reiniciarJuego();
    }
}

function reiniciarJuego() {
    if (timeoutTurno) clearTimeout(timeoutTurno);
    document.getElementById('modal-reinicio').style.display = 'flex';
    hablar("Opciones de reinicio en pantalla. Selecciona reiniciar desde cero, cambiar jugadores, o cancelar.", true);
}

function ocultarModalReinicio() {
    document.getElementById('modal-reinicio').style.display = 'none';
}

function ejecutarReinicio(tipo) {
    ocultarModalReinicio();
    
    if (tipo === 'config') {
        document.getElementById('juego').style.display = 'none';
        document.getElementById('configuracion').style.display = 'block';
        reiniciarRegistro();
        hablar("Volviendo a la pantalla de configuración.");
    } else if (tipo === 'mismos') {
        for(let i=0; i<numJugadores; i++) {
            jugadores[i].posicion = 0;
            jugadores[i].turnosJugados = 0;
            jugadores[i].vueltas = 0;
            jugadores[i].dinero = 10000;
            jugadores[i].propiedades = [];
            jugadores[i].cayoEnEspecial = false;
        }
        propietarios.fill(null);
        jugadorActualIndex = 0;
        yaTiro = false;
        actualizarInterfaz();
        reiniciarRegistro('El juego ha sido reiniciado. Todos vuelven a la Meta.');
        hablar("Bienvenidos a Viaje Azteca. El juego ha sido reiniciado desde cero. Todos vuelven a la Meta.");
    }
}

function reiniciarRegistro(mensajeInicial = null) {
    registro.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = 'Registro de jugadas:';
    registro.appendChild(strong);
    registro.appendChild(document.createElement('br'));
    if (mensajeInicial) {
        const span = document.createElement('span');
        span.textContent = mensajeInicial;
        registro.appendChild(span);
        registro.appendChild(document.createElement('br'));
    }
}

function agregarRegistro(mensaje) {
    const span = document.createElement('span');
    span.textContent = "- " + mensaje;
    registro.appendChild(span);
    registro.appendChild(document.createElement('br'));
    registro.scrollTop = registro.scrollHeight; // Auto-scroll
}

function mostrarReglas() {
    let expInput = document.getElementById('nivel-experiencia') ? document.getElementById('nivel-experiencia').value : 'principiante';
    const esExp = (expInput === 'experimentado');
    
    let textoReglas = "Reglas del Viaje Azteca para " + (esExp ? "Experimentados. " : "Principiantes. ");
    if (!esExp) {
        textoReglas += "Regla 1. En tu primera vuelta completa solo avanzarás para conocer el tablero. " +
                       "Regla 2. A partir de tu segunda vuelta, podrás comprar los estados en los que caigas. " +
                       "Regla 3. Cada jugador comienza con diez mil pesos y el sistema administra el dinero. " +
                       "Regla 4. Si caes en una propiedad ajena pagarás renta, y si te quedas sin dinero pierdes. " +
                       "Regla 5. Tienes 10 segundos para jugar tu turno.";
    } else {
        textoReglas += "Regla 1. Como ya saben jugar, la opción de compra se desbloquea en cuanto pasen la Meta y empiecen la segunda vuelta. " +
                       "Regla 2. Todos comienzan con diez mil pesos y el sistema administra las rentas y pagos automáticamente. " +
                       "Regla 3. El juego es dinámico: si se quedan sin dinero para una renta o multa, pierden. " +
                       "Regla 4. Cuentan con 10 segundos de tiempo límite para tomar sus decisiones.";
    }
        
    hablar(textoReglas, true);
}

function tirarDado() {
    reproducirSonido('dado');
    const j = jugadores[jugadorActualIndex];
    j.turnosJugados++;
    
    const carasDado = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    let d1 = Math.floor(Math.random() * 6) + 1;
    let avance = d1;
    
    // Forzar caída en especial si va a pasar la Meta y no ha caído (trampa del sistema para garantizar probabilidad)
    if (j.turnosJugados > 2 && !j.cayoEnEspecial && j.posicion + avance >= casillas.length) {
        let especialEncontrada = -1;
        for (let i = j.posicion + 1; i < casillas.length; i++) {
            if (casillas[i] === "Beneficio" || casillas[i] === "Cárcel") {
                especialEncontrada = i;
                break;
            }
        }
        if (especialEncontrada !== -1) {
            let dist = especialEncontrada - j.posicion;
            if (dist <= 6) {
                avance = dist;
                d1 = dist;
            }
        }
    }

    const nuevaPosicion = j.posicion + avance;
    let pasoMeta = false;
    if (nuevaPosicion >= casillas.length && j.turnosJugados > 1) {
        pasoMeta = true;
        j.vueltas++;
        j.dinero += 2000;
        j.cayoEnEspecial = false; // Resetear bandera al pasar la meta
    }
    j.posicion = nuevaPosicion % casillas.length;
    const nombreCasilla = casillas[j.posicion];
    const costo = costoCasilla(j.posicion);
    const zonaCasilla = obtenerZona(j.posicion);

    if (nombreCasilla === "Beneficio" || nombreCasilla === "Cárcel") {
        j.cayoEnEspecial = true;
    }

    resultadoDado.textContent = carasDado[d1 - 1];
    
    let mensaje = `Jugador ${j.id} tiró ${avance}. Avanza a ${nombreCasilla}`;
    if (zonaCasilla) mensaje += ` (${zonaCasilla})`;
    mensaje += `.`;
    if (pasoMeta) mensaje += ` Pasó por la Meta y cobró $2000.`;
    
    let renta = 0;
    if (nombreCasilla === "Beneficio") {
        j.dinero += 1000;
        mensaje += ` ¡Beneficio! Gana $1000.`;
    } else if (nombreCasilla === "Cárcel") {
        j.dinero -= 2000;
        j.posicion = (j.posicion - 2 + casillas.length) % casillas.length;
        const nuevoNombre = casillas[j.posicion];
        mensaje += ` ¡Cárcel! Paga $2000 y retrocede a ${nuevoNombre}.`;
    } else {
        const duenoId = propietarios[j.posicion];
        if (costo > 0) {
            if (j.vueltas === 0) {
                mensaje += ` (Primera vuelta, compras bloqueadas).`;
            } else if (duenoId === null) {
                mensaje += ` Costo: $${costo}.`;
            } else if (duenoId === j.id) {
                mensaje += ` Esta propiedad es tuya.`;
            } else {
                renta = Math.floor(costo / 2);
                mensaje += ` Es del Jugador ${duenoId}. Paga renta de $${renta}.`;
                j.dinero -= renta;
                jugadores[duenoId - 1].dinero += renta;
            }
        }
    }
    
    agregarRegistro(mensaje);
    yaTiro = true;
    btnTirar.disabled = true;
    
    let msgVoz = `Tiraste un ${d1}, avanzas ${avance} casillas y llegaste a ${nombreCasilla}`;
    if (zonaCasilla) msgVoz += `, en la ${zonaCasilla}. `;
    else msgVoz += `. `;
    if (pasoMeta) msgVoz += `Pasaste por la Meta y el banco te ha pagado 2000 pesos. `;

    if (nombreCasilla === "Beneficio") {
        reproducirSonido('beneficio');
        msgVoz += `¡Felicidades, caíste en un Beneficio! El banco te regala 1000 pesos. Tu saldo es ${j.dinero} pesos.`;
        btnComprar.disabled = true;
        btnRepetir.disabled = false;
        btnInventario.disabled = (j.propiedades.length === 0);
        hablar(msgVoz, false, () => {
            timeoutTurno = setTimeout(() => { if (yaTiro) pasarTurno(true); }, 10000);
        });
    } else if (nombreCasilla === "Cárcel") {
        reproducirSonido('carcel');
        const nuevoNombre = casillas[j.posicion];
        msgVoz += `¡Qué mala suerte, caíste en la Cárcel! Pagas una multa de 2000 pesos y retrocedes dos casillas hasta ${nuevoNombre}. Tu saldo es ${j.dinero} pesos.`;
        if (j.dinero <= 0) {
            msgVoz += ` Te has quedado sin dinero para pagar la multa.`;
            agregarRegistro(`¡El jugador ${j.id} se ha quedado sin dinero!`);
        }
        btnComprar.disabled = true;
        btnRepetir.disabled = false;
        btnInventario.disabled = (j.propiedades.length === 0);
        hablar(msgVoz, false, () => {
            timeoutTurno = setTimeout(() => { if (yaTiro) pasarTurno(true); }, 10000);
        });
    } else {
        if (j.vueltas === 0) {
            btnComprar.disabled = true;
            btnRepetir.disabled = true;
            btnInventario.disabled = true;
            
            hablar(msgVoz, false, () => {
                pasarTurno(true);
            });
        } else {
            const duenoId = propietarios[j.posicion];
            if (costo === 0) {
                btnComprar.disabled = true;
            } else if (duenoId === null) {
                msgVoz += `Esta propiedad no tiene dueño y cuesta ${costo} pesos. Tienes ${j.dinero} pesos.`;
                btnComprar.disabled = (j.dinero < costo);
            } else if (duenoId === j.id) {
                msgVoz += `Esta propiedad ya te pertenece.`;
                btnComprar.disabled = true;
            } else {
                msgVoz += `Esta propiedad pertenece al Jugador ${duenoId}. Le has pagado una renta automática de ${renta} pesos. Te quedan ${j.dinero} pesos.`;
                btnComprar.disabled = true;
                if (j.dinero <= 0) {
                    msgVoz += ` Te has quedado sin dinero para pagar la renta.`;
                    agregarRegistro(`¡El jugador ${j.id} se ha quedado sin dinero!`);
                }
            }
            
            btnRepetir.disabled = false;
            btnInventario.disabled = (j.propiedades.length === 0);
            
            hablar(msgVoz, false, () => {
                timeoutTurno = setTimeout(() => {
                    if (yaTiro) pasarTurno(true);
                }, 10000);
            });
        }
    }
}

function pasarTurno(esAutomatico = false) {
    if (!yaTiro) return;
    const j = jugadores[jugadorActualIndex];
    if (!esAutomatico) {
        agregarRegistro(`Jugador ${j.id} pasó su turno manualmente.`);
        hablar(`El jugador ${j.id} pasó su turno.`, true);
    } else {
        agregarRegistro(`Turno del jugador ${j.id} ha finalizado automáticamente.`);
    }
    finalizarTurno();
}

function escucharInventario() {
    const j = jugadores[jugadorActualIndex];
    let msg = `Eres el Jugador ${j.id}. Tienes ${j.dinero} pesos. `;
    if (j.propiedades.length === 0) {
        msg += "Actualmente no tienes ninguna propiedad.";
    } else {
        msg += `Eres dueño de: ${j.propiedades.join(", ")}.`;
    }
    hablar(msg, true);
}

function repetirTurno() {
    if (timeoutTurno) clearTimeout(timeoutTurno);
    const j = jugadores[jugadorActualIndex];
    const nombreCasilla = casillas[j.posicion];
    const zonaCasilla = obtenerZona(j.posicion);
    const costo = costoCasilla(j.posicion);
    const duenoId = propietarios[j.posicion];
    
    let msgVoz = `Estás en ${nombreCasilla}`;
    if (zonaCasilla) msgVoz += `, en la ${zonaCasilla}. `;
    else msgVoz += `. `;
    
    if (nombreCasilla === "Beneficio") {
        msgVoz += `Esta es una casilla especial de regalo. Tienes ${j.dinero} pesos.`;
    } else if (nombreCasilla === "Cárcel") {
        msgVoz += `Esta es la casilla de la cárcel. Tienes ${j.dinero} pesos.`;
    } else if (costo > 0) {
        if (duenoId === null) {
            msgVoz += `Esta propiedad no tiene dueño y cuesta ${costo} pesos. Tienes ${j.dinero} pesos.`;
        } else if (duenoId === j.id) {
            msgVoz += `Esta propiedad es tuya.`;
        } else {
            msgVoz += `Esta propiedad pertenece al Jugador ${duenoId}. Tienes ${j.dinero} pesos.`;
        }
    }
    
    agregarRegistro(`Jugador ${j.id} repitió la información.`);
    
    hablar(msgVoz, true, () => {
        timeoutTurno = setTimeout(() => {
            if (yaTiro) {
                agregarRegistro("Tiempo de espera agotado.");
                hablar("Tiempo de espera agotado.", true);
                pasarTurno(true);
            }
        }, 10000);
    });
}

function comprarPropiedad() {
    if (!yaTiro) return;
    const j = jugadores[jugadorActualIndex];
    const nombreCasilla = casillas[j.posicion];
    const costo = costoCasilla(j.posicion);

    if (j.dinero >= costo && propietarios[j.posicion] === null) {
        if (timeoutTurno) clearTimeout(timeoutTurno); // Detener el auto-pass mientras decide
        
        hablar(`¿Estás seguro de comprar el estado de ${nombreCasilla} por ${costo} pesos? Presiona aceptar o cancelar en la pantalla.`, true, () => {
            if (confirm(`¿Estás seguro de comprar el estado de ${nombreCasilla} por $${costo}?`)) {
                reproducirSonido('comprar');
                j.dinero -= costo;
                propietarios[j.posicion] = j.id;
                j.propiedades.push(nombreCasilla);
                
                agregarRegistro(`Jugador ${j.id} compró ${nombreCasilla} por $${costo}. Su balance es de $${j.dinero}.`);
                hablar(`El jugador ${j.id} compró el estado de ${nombreCasilla}.`, true);
                
                if (j.dinero <= 0) {
                    agregarRegistro(`¡El jugador ${j.id} se ha quedado sin dinero!`);
                    hablar(`El jugador ${j.id} se ha quedado sin dinero para comprar estados.`, false);
                }
                finalizarTurno();
            } else {
                agregarRegistro(`Jugador ${j.id} decidió no comprar ${nombreCasilla}.`);
                hablar(`El jugador ${j.id} decidió no comprar.`, true);
                finalizarTurno(); 
            }
        });
    } else {
        alert("No tienes suficiente dinero.");
    }
}

function finalizarTurno() {
    if (timeoutTurno) clearTimeout(timeoutTurno);
    jugadorActualIndex = (jugadorActualIndex + 1) % numJugadores;
    yaTiro = false;
    
    agregarRegistro(`--- Inicia el turno del Jugador ${jugadores[jugadorActualIndex].id} ---`);
    actualizarInterfaz();
}

let bienvenidaGeneralDicha = false;
function reproducirMusicaAztecaYBienvenida() {
    if (bienvenidaGeneralDicha) return;
    bienvenidaGeneralDicha = true;
    
    hablar("Bienvenidos a Viaje Azteca.", true, () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            function playDrum(time) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(150, time);
                osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
                gain.gain.setValueAtTime(1, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
                osc.start(time);
                osc.stop(time + 0.2);
            }
            
            function playFlute(freq, time, duration) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.3, time + 0.1);
                gain.gain.setValueAtTime(0.3, time + duration - 0.1);
                gain.gain.linearRampToValueAtTime(0, time + duration);
                osc.start(time);
                osc.stop(time + duration);
            }
            
            const t = ctx.currentTime;
            playDrum(t); playDrum(t + 0.4); playDrum(t + 0.8); playDrum(t + 1.2); playDrum(t + 1.6); playDrum(t + 2.0);
            playFlute(659.25, t, 0.4); playFlute(783.99, t + 0.4, 0.4); playFlute(880.00, t + 0.8, 0.8); playFlute(783.99, t + 1.6, 0.4); playFlute(659.25, t + 2.0, 0.8);
        } catch(e) {
            console.log("Web Audio API no soportada", e);
        }
    });
}
document.addEventListener('click', reproducirMusicaAztecaYBienvenida, {once: true});
document.addEventListener('touchstart', reproducirMusicaAztecaYBienvenida, {once: true});

function reproducirSonido(tipo) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const t = ctx.currentTime;
        if (tipo === 'dado') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
            gain.gain.setValueAtTime(0.5, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (tipo === 'comprar') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, t);
            osc.frequency.setValueAtTime(1500, t + 0.1);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.3);
            osc.start(t);
            osc.stop(t + 0.3);
        } else if (tipo === 'beneficio') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.setValueAtTime(600, t + 0.1);
            osc.frequency.setValueAtTime(800, t + 0.2);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.4);
            osc.start(t);
            osc.stop(t + 0.4);
        } else if (tipo === 'carcel') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, t);
            osc.frequency.linearRampToValueAtTime(50, t + 0.4);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.4);
            osc.start(t);
            osc.stop(t + 0.4);
        }
    } catch(e) {}
}

// Exponer funciones globales para que funcionen con los botones del HTML
window.iniciarJuego = iniciarJuego;
window.accionBoton = accionBoton;
window.mostrarReglas = mostrarReglas;
window.ejecutarReinicio = ejecutarReinicio;
window.ocultarModalReinicio = ocultarModalReinicio;

})(); // Fin del IIFE
