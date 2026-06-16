// =========================================================================
// ORÁCULO DEFINITIVO - PARTE 1: CONFIGURACIÓN, CLIMA REAL & ENERGÍAS
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Estado de la Aplicación ---
    let climaActual = {
        temperatura: 22,
        viento: 18,
        estado: 'Despejado',
        icono: '☀️'
    };
    
    let combinacionActual = [];
    let energiaSeleccionada = "Calma Marina";

    // --- Base de Datos Mística de Frases (Suerte Canaria) ---
    const frasesMisticas = [
        "El camino se descubre caminando, no mirando el mapa desde la orilla.",
        "La lava del Teide tardó en enfriarse, pero forjó la tierra más firme. Ten paciencia en tu fortuna.",
        "El viento Alisio sopla hoy a tu favor; limpia tus dudas y confía en el primer impulso.",
        "Como el Mar de las Calmas en El Hierro, la verdadera suerte llega cuando el espíritu está sereno.",
        "El Garoé derrama hoy gotas de fortuna sobre tu constelación. El momento es ahora.",
        "La suerte no es azar; es la sincronía perfecta entre la energía de las islas y tu intuición.",
        "Mira hacia el horizonte de la Restinga: allí donde el sol se oculta, nacen tus números de luz.",
        "Un cupón en tus manos no es solo papel, es el vehículo de un sueño que la ONCE bendice hoy."
    ];

    const configuracionJuegos = {
        superonce: { min: 1, max: 85, cantidad: 11, nombre: "Super Once" },
        triplex:   { min: 0, max: 9,  cantidad: 3,  nombre: "Triplex" },
        midia:     { min: 1, max: 31, cantidad: 1,  nombre: "Mi Día" },
        dupla:     { min: 0, max: 9,  cantidad: 2,  nombre: "Dupla" }
    };

    // --- Elementos del DOM ---
    const txtOraculo       = document.getElementById('oraculo-texto');
    const txtFecha         = document.getElementById('oraculo-fecha');
    const btnGenerate      = document.getElementById('btn-generate');
    const ballsOutput      = document.getElementById('balls-output');
    const btnSave          = document.getElementById('btn-save');
    const selectJuego      = document.getElementById('game-select');
    const selectSigno      = document.getElementById('signo-select');
    const btnsEnergia      = document.querySelectorAll('.btn-option');
    const consejoOnce      = document.getElementById('cli-consejo');
    const listaGuardados   = document.getElementById('saved-list');
    const emptyState       = document.getElementById('empty-state');

    // Elementos de la barra de Clima
    const elTemp           = document.getElementById('cli-temp');
    const elViento         = document.getElementById('cli-viento');
    const elEstado         = document.getElementById('cli-estado');
    const elIcono          = document.getElementById('cli-estado-ico');

    // ==========================================
    // 1. CONEXIÓN API DE CLIMA REAL (EL PINAR DE EL HIERRO)
    // ==========================================
    async function consultarClimaReal() {
        // Coordenadas exactas de El Pinar de El Hierro
        const lat = 27.7024;
        const lon = -17.9781;
        const url = `https://open-meteo.com{lat}&longitude=${lon}&current_weather=true`;

        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            const tiempo = datos.current_weather;

            climaActual.temperatura = Math.round(tiempo.temperature);
            climaActual.viento = Math.round(tiempo.windspeed);
            
            const code = tiempo.weathercode;
            if (code === 0) { climaActual.estado = "Despejado"; climaActual.icono = "☀️"; }
            else if (code <= 3) { climaActual.estado = "Nublado"; climaActual.icono = "⛅"; }
            else if (code <= 48) { climaActual.estado = "Niebla mística"; climaActual.icono = "🌫️"; }
            else { climaActual.estado = "Lluvia de abundancia"; climaActual.icono = "🌧️"; }

            actualizarInterfazClima();
        } catch (error) {
            console.log("Usando clima místico local por desconexión de red.");
            actualizarInterfazClima();
        }
    }

    function actualizarInterfazClima() {
        if(elTemp) elTemp.textContent = `${climaActual.temperatura}°C`;
        if(elViento) elViento.textContent = `${climaActual.viento} km/h`;
        if(elEstado) elEstado.textContent = climaActual.estado;
        if(elIcono) elIcono.textContent = climaActual.icono;
        
        const elMarea = document.getElementById('cli-marea');
        if (elMarea) {
            elMarea.textContent = new Date().getHours() % 12 < 6 ? "Alta" : "Baja";
        }
        
        actualizarFraseConsejo();
    }

    function actualizarFraseConsejo() {
        if (consejoOnce) {
            consejoOnce.textContent = `✨ Energía [${energiaSeleccionada}]: El oráculo se rige por vientos de El Pinar a ${climaActual.viento} km/h y ambiente ${climaActual.estado}. Propicio para apuestas intuitivas.`;
        }
    }

    // ==========================================
    // 2. MOTOR DE ENERGÍAS Y PESTAÑAS
    // ==========================================
    btnsEnergia.forEach(btn => {
        if (!btn.id && !btn.dataset.tab) { 
            btn.addEventListener('click', (e) => {
                btnsEnergia.forEach(b => { if(!b.id && !b.dataset.tab) b.classList.remove('active'); });
                e.target.classList.add('active');
                energiaSeleccionada = e.target.textContent.trim();
                actualizarFraseConsejo();
            });
        }
    });

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
    // ==========================================
    // 3. GENERADOR DE PREDICCIONES CON HORÓSCOPO
    // ==========================================
    btnGenerate.addEventListener('click', () => {
        if (!selectJuego || !selectSigno) return;
        const juego = selectJuego.value;
        const config = configuracionJuegos[juego];
        const signoTexto = selectSigno.options[selectSigno.selectedIndex].text;
        
        btnGenerate.style.transform = "scale(0.95)";
        setTimeout(() => btnGenerate.style.transform = "scale(1)", 150);

        txtOraculo.textContent = `“ ${frasesMisticas[Math.floor(Math.random() * frasesMisticas.length)]} ”`;

        const semillaSigno = selectSigno.value.length + climaActual.temperatura;
        combinacionActual = [];
        
        if (juego === 'midia') {
            const diaSurgido = ((Math.floor(Math.random() * 31) + semillaSigno) % 31) + 1;
            combinacionActual.push(diaSurgido);
        } else {
            while (combinacionActual.length < config.cantidad) {
                let numero = ((Math.floor(Math.random() * config.max) + semillaSigno) % (config.max - config.min + 1)) + config.min;
                if (!combinacionActual.includes(numero)) {
                    combinacionActual.push(numero);
                }
            }
            combinacionActual.sort((a, b) => a - b);
        }

        ballsOutput.innerHTML = '';
        combinacionActual.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.className = 'ball';
            ball.style.animationDelay = `${index * 0.08}s`;
            ball.textContent = num.toString().padStart(2, '0');
            ballsOutput.appendChild(ball);
        });

        if (btnSave) btnSave.style.display = 'block';
        if (consejoOnce) {
            consejoOnce.textContent = `🔮 Alineación Astral con ${signoTexto}. Tus números sagrados para el ${config.nombre} han sido bendecidos.`;
        }
    });

    // ==========================================
    // 4. SISTEMA DE BITÁCORA (LOCALSTORAGE)
    // ==========================================
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            if (combinacionActual.length === 0) return;

            const juegoTexto = selectJuego.options[selectJuego.selectedIndex].text;
            const signoTexto = selectSigno.options[selectSigno.selectedIndex].text;
            const nuevaCombinacion = {
                id: Date.now(),
                juego: juegoTexto,
                signo: signoTexto,
                numeros: [...combinacionActual],
                fecha: new Date().toLocaleDateString('es-ES')
            };

            let guardados = JSON.parse(localStorage.getItem('bitacoraCanaria')) || [];
            guardados.push(nuevaCombinacion);
            localStorage.setItem('bitacoraCanaria', JSON.stringify(guardados));

            btnSave.style.display = 'none';
            cargarBitacora();
        });
    }

    function cargarBitacora() {
        if (!listaGuardados) return;
        
        let guardados = JSON.parse(localStorage.getItem('bitacoraCanaria')) || [];
        listaGuardados.innerHTML = '';

        if (guardados.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        guardados.reverse().forEach(item => {
            const li = document.createElement('li');
            li.className = 'saved-item';
            const numsFormateados = item.numeros.map(n => n.toString().padStart(2, '0')).join(', ');
            
            li.innerHTML = `
                <div>
                    <strong style="color: var(--accent); font-family: 'Cinzel', serif;">${item.juego}</strong> 
                    <span style="color: var(--text-muted); font-size:0.8rem; margin-left: 8px;">✨ ${item.signo} • ${item.fecha}</span>
                    <div class="font-mono" style="margin-top:6px; font-size:1.1rem; letter-spacing:1px;">🔮 [ ${numsFormateados} ]</div>
                </div>
                <button class="btn-delete" data-id="${item.id}">Borrar 🗑️</button>
            `;
            listaGuardados.appendChild(li);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idABorrar = parseInt(e.target.getAttribute('data-id'));
                let guardadosActuales = JSON.parse(localStorage.getItem('bitacoraCanaria')) || [];
                let filtrados = guardadosActuales.filter(item => item.id !== idABorrar);
                localStorage.setItem('bitacoraCanaria', JSON.stringify(filtrados));
                cargarBitacora();
            });
        });
    }

    // ==========================================
    // 5. INICIALIZACIÓN DE LA APP
    // ==========================================
    if (txtFecha) {
        txtFecha.textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const hotTab = document.getElementById('tab-hot');
    const coldTab = document.getElementById('tab-cold');
    if (hotTab) {
        hotTab.innerHTML = `
            <div class="stat-row"><div class="mini-ball">24</div><div class="progress-bar"><div class="progress-fill" style="width: 88%;"></div></div><span class="font-mono">88%</span></div>
            <div class="stat-row"><div class="mini-ball">78</div><div class="progress-bar"><div class="progress-fill" style="width: 76%;"></div></div><span class="font-mono">76%</span></div>
        `;
    }
    if (coldTab) {
        coldTab.innerHTML = `
            <div class="stat-row"><div class="mini-ball cold">05</div><div class="progress-bar"><div class="progress-fill cold" style="width: 12%;"></div></div><span class="font-mono">12%</span></div>
            <div class="stat-row"><div class="mini-ball cold">61</div><div class="progress-bar"><div class="progress-fill cold" style="width: 19%;"></div></div><span class="font-mono">19%</span></div>
        `;
    }

    consultarClimaReal();
    cargarBitacora();
});
