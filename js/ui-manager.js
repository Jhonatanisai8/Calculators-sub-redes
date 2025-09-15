/**
 * Módulo Gestor de Interfaz
 * Maneja toda la interacción con la interfaz de usuario
 */
class GestorInterfaz {
    /**
     * Constructor del GestorInterfaz
     * Inicializa las referencias a los elementos del DOM
     */
    constructor() {
        this.inicializarElementos();
    }

    /**
     * Inicializa las referencias a todos los elementos del DOM
     */
    inicializarElementos() {
        // Elementos del formulario
        this.formulario = document.getElementById('subnet-form');
        this.entradaIP = document.getElementById('ip-address');
        this.selectorTipoEntrada = document.getElementById('input-type');
        this.grupoHosts = document.getElementById('hosts-group');
        this.grupoMascara = document.getElementById('mask-group');
        this.entradaHosts = document.getElementById('hosts-count');
        this.entradaMascara = document.getElementById('subnet-mask');
        this.botonCalcular = document.getElementById('calculate-btn');
        
        // Elementos de mensajes y resultados
        this.mensajeError = document.getElementById('error-message');
        this.seccionResultados = document.getElementById('results-section');
        
        // Elementos de resultados específicos
        this.elementoIPRed = document.getElementById('network-ip');
        this.elementoMascaraSubred = document.getElementById('subnet-mask-result');
        this.elementoIPBroadcast = document.getElementById('broadcast-ip');
        this.elementoPrimerHost = document.getElementById('first-host');
        this.elementoUltimoHost = document.getElementById('last-host');
        this.elementoGateway = document.getElementById('gateway');
        this.elementoTotalHosts = document.getElementById('total-hosts');
    }

    /**
     * Configura todos los event listeners de la interfaz
     */
    configurarEventListeners() {
        // Event listener para el cambio de tipo de entrada
        this.selectorTipoEntrada.addEventListener('change', () => {
            this.alternarCamposEntrada();
        });

        // Event listeners para limpiar resultados al cambiar inputs
        this.entradaIP.addEventListener('input', () => {
            this.limpiarResultados();
        });

        this.entradaHosts.addEventListener('input', () => {
            this.limpiarResultados();
        });

        this.entradaMascara.addEventListener('input', () => {
            this.limpiarResultados();
        });

        // Event listener para validación en tiempo real
        this.entradaIP.addEventListener('blur', () => {
            this.validarIPEnTiempoReal();
        });

        this.entradaMascara.addEventListener('blur', () => {
            this.validarMascaraEnTiempoReal();
        });
    }

    /**
     * Alterna entre los campos de entrada según el tipo seleccionado
     */
    alternarCamposEntrada() {
        const tipoEntrada = this.selectorTipoEntrada.value;
        
        if (tipoEntrada === 'hosts') {
            this.grupoHosts.style.display = 'block';
            this.grupoMascara.style.display = 'none';
            this.entradaHosts.required = true;
            this.entradaMascara.required = false;
            this.entradaMascara.value = ''; // Limpiar el campo no usado
        } else {
            this.grupoHosts.style.display = 'none';
            this.grupoMascara.style.display = 'block';
            this.entradaHosts.required = false;
            this.entradaMascara.required = true;
            this.entradaHosts.value = ''; // Limpiar el campo no usado
        }
        
        this.limpiarResultados();
    }

    /**
     * Muestra un mensaje de error en la interfaz
     * @param {string} mensaje - Mensaje de error a mostrar
     */
    mostrarError(mensaje) {
        this.mensajeError.textContent = mensaje;
        this.mensajeError.style.display = 'block';
        this.seccionResultados.style.display = 'none';
        
        // Scroll hacia el error para mejor UX
        this.mensajeError.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    /**
     * Oculta el mensaje de error
     */
    ocultarError() {
        this.mensajeError.style.display = 'none';
    }

    /**
     * Muestra los resultados del cálculo en la interfaz
     * @param {ResultadoIp} resultado - Objeto ResultadoIp con los resultados
     */
    mostrarResultados(resultado) {
        // Verificar que el resultado sea válido
        if (!resultado || !resultado.esValido()) {
            this.mostrarError('Error: Los resultados del cálculo no son válidos.');
            return;
        }

        // Actualizar elementos con los resultados
        this.elementoIPRed.textContent = resultado.networkIP;
        this.elementoMascaraSubred.textContent = resultado.subnetMask;
        this.elementoIPBroadcast.textContent = resultado.broadcastIP;
        this.elementoPrimerHost.textContent = resultado.firstHostIP;
        this.elementoUltimoHost.textContent = resultado.lastHostIP;
        this.elementoGateway.textContent = resultado.gatewayIP;
        this.elementoTotalHosts.textContent = resultado.totalHosts.toLocaleString();
        
        // Mostrar la sección de resultados
        this.ocultarError();
        this.seccionResultados.style.display = 'block';
        
        // Scroll hacia los resultados para mejor UX
        this.seccionResultados.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    /**
     * Limpia los resultados y oculta la sección de resultados
     */
    limpiarResultados() {
        this.seccionResultados.style.display = 'none';
        this.ocultarError();
    }

    /**
     * Obtiene los datos del formulario
     * @returns {object} - Objeto con los datos del formulario
     */
    obtenerDatosFormulario() {
        return {
            ip: this.entradaIP.value.trim(),
            tipoEntrada: this.selectorTipoEntrada.value,
            numeroHosts: parseInt(this.entradaHosts.value.trim()) || 0,
            mascara: this.entradaMascara.value.trim()
        };
    }

    /**
     * Valida la IP en tiempo real (cuando el usuario sale del campo)
     */
    validarIPEnTiempoReal() {
        const ip = this.entradaIP.value.trim();
        if (ip && !Validador.esDireccionIPValida(ip)) {
            this.entradaIP.style.borderColor = '#e74c3c';
            this.entradaIP.style.backgroundColor = '#fdf2f2';
        } else {
            this.entradaIP.style.borderColor = '#e1e5e9';
            this.entradaIP.style.backgroundColor = '#fafbfc';
        }
    }

    /**
     * Valida la máscara en tiempo real (cuando el usuario sale del campo)
     */
    validarMascaraEnTiempoReal() {
        const mascara = this.entradaMascara.value.trim();
        if (mascara && !Validador.esMascaraSubredValida(mascara)) {
            this.entradaMascara.style.borderColor = '#e74c3c';
            this.entradaMascara.style.backgroundColor = '#fdf2f2';
        } else {
            this.entradaMascara.style.borderColor = '#e1e5e9';
            this.entradaMascara.style.backgroundColor = '#fafbfc';
        }
    }

    /**
     * Resetea los estilos de validación de todos los campos
     */
    resetearEstilosValidacion() {
        const campos = [this.entradaIP, this.entradaHosts, this.entradaMascara];
        campos.forEach(campo => {
            campo.style.borderColor = '#e1e5e9';
            campo.style.backgroundColor = '#fafbfc';
        });
    }

    /**
     * Muestra un indicador de carga durante el cálculo
     */
    mostrarCargando() {
        this.botonCalcular.disabled = true;
        this.botonCalcular.textContent = 'Calculando...';
        this.botonCalcular.style.opacity = '0.7';
    }

    /**
     * Oculta el indicador de carga
     */
    ocultarCargando() {
        this.botonCalcular.disabled = false;
        this.botonCalcular.textContent = 'Calcular';
        this.botonCalcular.style.opacity = '1';
    }

    /**
     * Añade información adicional a los resultados (tooltip o información extra)
     * @param {ResultadoIp} resultado - Objeto ResultadoIp con los resultados
     */
    añadirInformacionAdicional(resultado) {
        // Añadir información CIDR
        const infoCIDR = document.createElement('div');
        infoCIDR.className = 'info-adicional';
        infoCIDR.innerHTML = `
            <small><strong>Notación CIDR:</strong> ${resultado.getRedCIDR()}</small>
        `;
        
        // Insertar después del último elemento de resultados
        const ultimoElemento = this.seccionResultados.querySelector('.results-grid');
        if (ultimoElemento && !this.seccionResultados.querySelector('.info-adicional')) {
            ultimoElemento.appendChild(infoCIDR);
        }
    }

    /**
     * Configura sugerencias automáticas para campos comunes
     */
    configurarSugerencias() {
        // Sugerencias para máscaras comunes
        const mascarasComunes = [
            '255.255.255.0',
            '255.255.255.128',
            '255.255.255.192',
            '255.255.255.224',
            '255.255.255.240',
            '255.255.255.248',
            '255.255.255.252'
        ];

        // Crear datalist para máscaras
        const datalistMascaras = document.createElement('datalist');
        datalistMascaras.id = 'mascaras-comunes';
        
        mascarasComunes.forEach(mascara => {
            const option = document.createElement('option');
            option.value = mascara;
            datalistMascaras.appendChild(option);
        });
        
        document.body.appendChild(datalistMascaras);
        this.entradaMascara.setAttribute('list', 'mascaras-comunes');
    }

    /**
     * Inicializa la configuración completa del UI Manager
     */
    inicializar() {
        this.configurarEventListeners();
        this.alternarCamposEntrada();
        this.configurarSugerencias();
        
        // Configuración inicial
        this.limpiarResultados();
        this.resetearEstilosValidacion();
    }

    /**
     * Maneja errores de la aplicación y los muestra de forma amigable
     * @param {Error} error - Error capturado
     */
    manejarError(error) {
        console.error('Error en la aplicación:', error);
        this.mostrarError('Ha ocurrido un error inesperado. Por favor, verifica los datos e intenta nuevamente.');
        this.ocultarCargando();
    }

    /**
     * Exporta los resultados en formato texto
     * @param {ResultadoIp} resultado - Resultado a exportar
     * @returns {string} - Texto formateado con los resultados
     */
    exportarResultados(resultado) {
        const fecha = new Date().toLocaleString();
        return `Calculadora de Subredes IP - Resultados\n` +
               `Fecha: ${fecha}\n` +
               `================================\n\n` +
               resultado.toString();
    }
}

// Exportar la clase para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GestorInterfaz;
}