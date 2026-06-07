// =========================================================================
// ORÁCULO DEFINITIVO - SCRIPT MÍSTICO & ESTADÍSTICO DE SUERTE CANARIA (ONCE)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Inicializaciones del Estado del Clima e Influencia de la Fortuna ---
    const climaActual = {
        temperatura: 22,
        viento: 18,
        marea: 'Alta',
        faseLunar: '',
        iconoLuna: '🌕'
    };

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

    // --- Configuración y Lógica de Sorteos Oficiales de la ONCE ---
    const configuracionJuegos = {
        superonce: { min: 1, max: 85, cantidad: 11, nombre: "Super Once" },
        triplex:   { min: 0, max: 9,  cantidad: 3,  nombre: "Triplex", repetir: true },
        midia:     { min: 1, max: 31, cantidad: 1,  nombre: "Mi Día (Día)", extra: "Mes y Año" },
        dupla:     { min: 0, max: 9,  cantidad: 2,  nombre: "Dupla" }
    };

    // --- Elementos de la Interfaz (DOM) ---
    const txtOraculo       = document.getElementById('oraculo-texto');
    const txtFecha         = document.getElementById('oraculo-fecha');
    const btnGenerate      = document.getElementById('btn-generate');
    const ballsOutput      = document.getElementById('balls-output');
    const btnSave          = document.getElementById('btn-save');
    const selectJuego      = document.getElementById('game-select');
    const btnsEnergia      = document.querySelectorAll('.btn-option');
    const consejoOnce      = document.getElementById('cli-consejo');
    const listaGuardados   = document.getElementById('saved-list');
    const emptyState       = document.getElementById('empty-state');
    const containerLuna    = document.getElementById('cli-luna');
    const icoLuna          = document.getElementById('cli-estado-ico');

    let combinacionActual = [];
    let energiaSeleccionada = "Calma Marina";

    // ==========================================
    // 1. MOTOR DE ENERGÍA Y EVENTOS DE INTERFAZ
    // ==========================================
    
    // Cambiar entre energías místicas
    btnsEnergia.forEach(btn => {
        if (!btn.id && btn.getAttribute('data-tab') === null && btn.id !== 'btn-save') { 
            btn.addEventListener('click', (e) => {
                // Remover clase activa de los hermanos de energía
                btnsEnergia.forEach(b => { if(!b.id && !b.dataset.tab && b.id !== 'btn-save') b.classList.remove('active'); });
                e.target.classList.add('active');
                energiaSeleccionada = e.target.textContent.trim();
                actualizarPrediccionConsejo();
            });
        }
    });

    // Control de Pestañas (Calientes, Fríos, Historial)
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
    // 2. CÁLCULO MÍSTICO DE LA FASE LUNAR REAL
    // ==========================================
    function calcularFaseLunarReal() {
        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const month = fechaActual.getMonth() + 1;
        const day = fechaActual.getDate();

        // Algoritmo del ciclo lunar
        let yearBase = year;
        let monthBase = month;
        if (monthBase < 3) { yearBase--; monthBase += 12; }
        monthBase++;
        
        const c = 365.25 * yearBase;
        const e = 30.6 * monthBase;
        let j = c + e + day - 694039.09;
        j /= 29.5305882; 
        const ip = j - Math.floor(j); 
        const edadLunar = ip * 29.53;

        let fase = "Luna Llena de Fortuna 🌕";
        let icono = "🌕";

        if (edadLunar < 1.84)   { fase = "Luna Nueva 🌑"; icono = "🌑"; }
        else if (edadLunar < 5.53)  { fase = "Creciente Iluminada 🌒"; icono = "🌒"; }
        else if (edadLunar < 9.22)  { fase = "Cuarto Creciente 🌓"; icono = "🌓"; }
        else if (edadLunar < 12.91) { fase = "Gibosa Creciente 🌔"; icono = "🌔"; }
        else if (edadLunar < 16.61) { fase = "Luna Llena de Fortuna 🌕"; icono = "🌕"; }
        else if (edadLunar < 20.30) { fase = "Gibosa Menguante 🌖"; icono = "🌖"; }
        else if (edadLunar < 23.99) { fase = "Cuarto Menguante 🌗"; icono = "🌗"; }
        else if (edadLunar < 27.68) { fase = "Menguante Mística 🌘"; icono = "🌘"; }

        climaActual.faseLunar = fase;
        climaActual.iconoLuna = icono;

        // Inyección ultra-segura en el HTML comprobando los ID
        const elLunaTxt = document.getElementById('cli-luna');
        const elLunaIco = document.getElementById('cli-luna-ico');
        
        if (elLunaTxt) elLunaTxt.textContent = fase;
        if (elLunaIco) elLunaIco.textContent = icono;

        generarNumerosEstadisticosEstacionales(edadLunar);
    }

    // ==========================================
    // 3. GENERADOR DE NÚMEROS ESTADÍSTICOS (CALIENTES/FRÍOS)
    // ==========================================
    function generarNumerosEstadisticosEstacionales(edadLunar) {
        // Modifica dinámicamente las barras de progreso laterales simulando estadísticas de la ONCE
        const hotTab = document.getElementById('tab-hot');
        const coldTab = document.getElementById('tab-cold');
        
        let semillaBase = Math.floor(edadLunar) + climaActual.temperatura;
        
        // Generar 2 números calientes basados místicamente en el día
        let numCaliente1 = (semillaBase % 49) + 1;
        let numCaliente2 = ((semillaBase * 3) % 85) + 1;
        if(numCaliente1 === numCaliente2) numCaliente2++;

        // Generar 2 números fríos
        let numFrio1 = ((semillaBase + 17) % 80) + 1;
        let numFrio2 = ((semillaBase * 7) % 9) + 1;

        hotTab.innerHTML = `
            <div class="stat-row">
                <div class="mini-ball">${numCaliente1.toString().padStart(2, '0')}</div>
                <div class="progress-bar"><div class="progress-fill" style="width: 88%;"></div></div>
                <span class="font-mono">88%</span>
            </div>
            <div class="stat-row">
                <div class="mini-ball">${numCaliente2.toString().padStart(2, '0')}</div>
                <div class="progress-bar"><div class="progress-fill" style="width: 76%;"></div></div>
                <span class="font-mono">76%</span>
            </div>
        `;

        coldTab.innerHTML = `
            <div class="stat-row">
                <div class="mini-ball cold">${numFrio1.toString().padStart(2, '0')}</div>
                <div class="progress-bar"><div class="progress-fill cold" style="width: 14%;"></div></div>
                <span class="font-mono">14%</span>
            </div>
            <div class="stat-row">
                <div class="mini-ball cold">${numFrio2.toString().padStart(2, '0')}</div>
                <div class="progress-bar"><div class="progress-fill cold" style="width: 21%;"></div></div>
                <span class="font-mono">21%</span>
            </div>
        `;
    }

    // Actualiza el consejo dinámico inferior según la energía y juego de la ONCE elegido
    function actualizarPrediccionConsejo() {
        const juego = selectJuego.value;
        let msg = `✨ Energía [${energiaSeleccionada}]: `;
        
        if (juego === 'superonce') msg += "El Super Once se rige hoy por corrientes profundas. Ideal para apuestas estables.";
        else if (juego === 'triplex') msg += "Numerología rápida. Tres ráfagas de viento Alisio configuran tu suerte directa.";
        else if (juego === 'midia') msg += "Tu fecha cósmica se cruza con las fases lunares del meridiano de El Hierro.";
        else msg += "Dupla activa. Dos fuerzas sagradas de la naturaleza empujan tu boleto ganador.";
        
        if(consejoOnce) consejoOnce.textContent = msg;
    }

    selectJuego.addEventListener('change', actualizarPrediccionConsejo);

    // ==========================================
    // 4. MOTOR PRINCIPAL GENERADOR DEL ORÁCULO
    // ==========================================
    btnGenerate.addEventListener('click', () => {
        const juegoSeleccionado = selectJuego.value;
        const config = configuracionJuegos[juegoSeleccionado];
        
        combinacionActual = [];
        ballsOutput.innerHTML = ""; // Limpiar bolas anteriores

        // Factor astrológico y climatológico para alterar sutilmente el azar aleatorio
        let factorMistico = energiaSeleccionada === "Fuerza Volcánica" ? 5 : (energiaSeleccionada === "Viento Alisio" ? 2 : 0);

        if (juegoSeleccionado === 'midia') {
            // Caso especial: Mi Día de la ONCE requiere Día (1-31) + Mes Extra + Año Extra ficticios o sugeridos místicamente
            let dia = Math.floor(Math.random() * config.max) + config.min;
            combinacionActual.push(dia);
            
            // Renderizar la bola del día principal

                        crearBolaAnimada(dia, false);
            
            const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            let mesSugerido = meses[Math.floor(Math.random() * 12)];
            let anoSugerido = Math.floor(Math.random() * 3) + 2026; 

            const extraDiv = document.createElement('div');
            extraDiv.style.color = "var(--accent)";
            extraDiv.style.fontFamily = "var(--font-mono)";
            extraDiv.style.fontSize = "0.9rem";
            extraDiv.style.marginTop = "12px";
            extraDiv.innerHTML = `📅 Fecha Mística sugerida: <strong>${dia} de ${mesSugerido} de ${anoSugerido}</strong>`;
            ballsOutput.appendChild(extraDiv);

        } else {
            while (combinacionActual.length < config.cantidad) {
                let num = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
                if (config.repetir) {
                    combinacionActual.push(num);
                } else {
                    if (!combinacionActual.includes(num)) {
                        combinacionActual.push(num);
                    }
                }
            }

            if (juegoSeleccionado !== 'triplex' && juegoSeleccionado !== 'dupla') {
                combinacionActual.sort((a, b) => a - b);
            }

            combinacionActual.forEach((num, index) => {
                setTimeout(() => {
                    crearBolaAnimada(num, false);
                }, index * 80);
            });
        }

        btnSave.style.display = "block";
        añadirAlHistorialLateral(config.nombre, combinacionActual);
    });

    function crearBolaAnimada(numero, esClon) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.textContent = numero.toString().padStart(2, '0');
        ballsOutput.appendChild(ball);
    }

        // ==========================================
    // 5. SISTEMA DE BITÁCORA / GUARDADO LOCAL
    // ==========================================
    btnSave.addEventListener('click', () => {
        if (combinacionActual.length === 0) return;

        const juegoId = selectJuego.value;
        const juegoNombre = configuracionJuegos[juegoId].nombre;
        const fechaYHora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const nuevaPrediccion = {
            juego: juegoNombre,
            numeros: [...combinacionActual],
            hora: fechaYHora,
            energia: energiaSeleccionada
        };

        let guardados = JSON.parse(localStorage.getItem('oraculo_guardados')) || [];
        guardados.unshift(nuevaPrediccion);
        localStorage.setItem('oraculo_guardados', JSON.stringify(guardados));

        renderizarGuardados();
        
        const originalText = btnSave.innerHTML;
        btnSave.innerHTML = "✨ ¡Guardado en tu Bitácora! ✨";
        btnSave.style.borderColor = "var(--success)";
        setTimeout(() => {
            btnSave.innerHTML = originalText;
            btnSave.style.borderColor = "var(--border)";
        }, 2000);
    });

    function renderizarGuardados() {
        let guardados = JSON.parse(localStorage.getItem('oraculo_guardados')) || [];
        if (!listaGuardados) return;

        if (guardados.length === 0) {
            emptyState.style.display = "block";
            listaGuardados.innerHTML = "";
            return;
        }

        emptyState.style.display = "none";
        listaGuardados.innerHTML = "";

        guardados.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'saved-item';
            li.style.background = 'rgba(255,255,255,0.02)';
            li.style.border = '1px solid var(--border)';
            li.style.padding = '16px';
            li.style.borderRadius = '8px';
            li.style.marginBottom = '12px';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';

            const numsFormateados = item.numeros.map(n => n.toString().padStart(2, '0')).join(' - ');

            li.innerHTML = `
                <div>
                    <span class="font-mono" style="font-size:0.75rem; color: var(--accent); text-transform:uppercase;">${item.juego} (${item.energia})</span>
                    <p class="font-mono" style="font-size:1.1rem; font-weight:bold; margin-top:4px; color:#fff;">${numsFormateados}</p>
                </div>
                <div style="text-align: right; display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
                    <span class="font-mono" style="font-size:0.7rem; color:var(--text-dark);">${item.hora}</span>
                    <button class="btn-delete" data-index="${index}" style="background:transparent; border:none; color:#f87171; cursor:pointer; font-size:0.8rem;">Eliminar</button>
                </div>
            `;
            listaGuardados.appendChild(li);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                let guardados = JSON.parse(localStorage.getItem('oraculo_guardados')) || [];
                guardados.splice(idx, 1);
                localStorage.setItem('oraculo_guardados', JSON.stringify(guardados));
                renderizarGuardados();
            });
        });
    }

    function añadirAlHistorialLateral(nombreJuego, numeros) {
        const historyList = document.querySelector('.draw-history-list');
        if (!historyList) return;

        const li = document.createElement('li');
        li.className = 'draw-item';
        const horaStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const numsFormateados = numeros.map(n => n.toString().padStart(2, '0')).join(' - ');

        li.innerHTML = `
            <span class="font-mono" style="font-size:0.75rem; color:var(--text-muted);">${nombreJuego} [${horaStr}]</span>
            <span class="font-mono" style="color: var(--accent); font-weight:bold;">${numsFormateados}</span>
        `;
        
        if (historyList.firstChild) {
            historyList.insertBefore(li, historyList.firstChild);
        } else {
            historyList.appendChild(li);
        }
    }

    // ==========================================
    // 6. MENSAJES ROTATIVOS MÍSTICOS (AL REFRESCAR)
    // ==========================================
    function establecerMensajeMisticoYFecha() {
        const fraseAleatoria = frasesMisticas[Math.floor(Math.random() * frasesMisticas.length)];
        if(txtOraculo) txtOraculo.textContent = `“ ${fraseAleatoria} ”`;

        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
        const hoy = new Date().toLocaleDateString('es-ES', opciones);
        if(txtFecha) txtFecha.textContent = hoy;
    }

    // --- Ejecución Inicial ---
    establecerMensajeMisticoYFecha();
    calcularFaseLunarReal();
    actualizarPrediccionConsejo();
    renderizarGuardados();
});
