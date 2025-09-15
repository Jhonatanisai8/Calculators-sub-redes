/**
 * Calculadora de Subredes IP - Archivo Principal
 * Coordina todos los módulos de la aplicación
 */

/**
 * Clase principal de la aplicación que coordina todos los módulos
 */
class AplicacionCalculadoraIP {
    /**
     * Constructor de la aplicación
     */
    constructor() {
        this.gestorInterfaz = null;
        this.inicializar();
    }

    /**
     * Inicializa la aplicación
     */
    inicializar() {
        console.log('Inicializando Aplicación Calculadora IP...');
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.detectarDispositivo();
                this.configurarAplicacion();
            });
        } else {
            this.detectarDispositivo();
            this.configurarAplicacion();
        }
    }

    /**
     * Detecta el tipo de dispositivo y aplica estilos correspondientes
     */
    detectarDispositivo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        // Detectar iOS (iPhone, iPad, iPod)
        const esIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        
        // Detectar macOS
        const esMacOS = /Mac/.test(platform) && !esIOS;
        
        // Detectar Windows
        const esWindows = /Win/.test(platform);
        
        // Aplicar clases CSS según el dispositivo
        const body = document.body;
        
        if (esIOS) {
            body.classList.add('ios-style');
            console.log('Aplicando estilos iOS');
        } else if (esMacOS || esWindows) {
            body.classList.add('macos-style');
            console.log('Aplicando estilos macOS/PC');
        } else {
            // Por defecto, usar estilos macOS
            body.classList.add('macos-style');
            console.log('Aplicando estilos por defecto (macOS)');
        }
    }

    /**
     * Configura todos los componentes de la aplicación
     */
    configurarAplicacion() {
        try {
            // Inicializar el Gestor de Interfaz
            this.gestorInterfaz = new GestorInterfaz();
            this.gestorInterfaz.inicializar();

            // Configurar el event listener principal del formulario
            this.configurarFormulario();

            console.log('Aplicación Calculadora IP inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            this.mostrarErrorInicializacion();
        }
    }

    /**
     * Configura el formulario principal
     */
    configurarFormulario() {
        const formulario = document.getElementById('subnet-form');
        if (formulario) {
            formulario.addEventListener('submit', (evento) => {
                this.manejarEnvioFormulario(evento);
            });
        } else {
            throw new Error('No se pudo encontrar el formulario principal');
        }
    }

    /**
     * Maneja el envío del formulario
     * @param {Event} evento - Evento del formulario
     */
    manejarEnvioFormulario(evento) {
        evento.preventDefault();

        try {
            // Obtener datos del formulario
            const datosFormulario = this.gestorInterfaz.obtenerDatosFormulario();
            
            // Validar entrada
            const validacion = Validador.validarEntradaCompleta(
                datosFormulario.ip,
                datosFormulario.tipoEntrada,
                datosFormulario.mascara,
                datosFormulario.numeroHosts
            );

            if (!validacion.esValido) {
                this.gestorInterfaz.mostrarError(validacion.mensaje);
                return;
            }

            // Realizar cálculos
            let resultado;
            if (datosFormulario.tipoEntrada === 'hosts') {
                resultado = CalculadoraSubredes.calcularDesdeHosts(
                    datosFormulario.ip,
                    datosFormulario.numeroHosts
                );
            } else {
                resultado = CalculadoraSubredes.calcularDesdeMascara(
                    datosFormulario.ip,
                    datosFormulario.mascara
                );
            }

            // Mostrar resultados
            this.gestorInterfaz.mostrarResultados(resultado);

        } catch (error) {
            console.error('Error al procesar el formulario:', error);
            this.gestorInterfaz.mostrarError('Error interno al procesar los datos. Por favor, inténtelo de nuevo.');
        }
    }

    /**
     * Muestra un error de inicialización
     */
    mostrarErrorInicializacion() {
        const contenedor = document.body;
        if (contenedor) {
            const mensajeError = document.createElement('div');
            mensajeError.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #f8d7da;
                color: #721c24;
                padding: 20px;
                border: 1px solid #f5c6cb;
                border-radius: 5px;
                text-align: center;
                z-index: 9999;
            `;
            mensajeError.innerHTML = `
                <h3>Error de Inicialización</h3>
                <p>No se pudo inicializar la aplicación correctamente.</p>
                <p>Por favor, recargue la página.</p>
            `;
            contenedor.appendChild(mensajeError);
        }
    }
}

// Inicializar la aplicación cuando se cargue el script
let aplicacion;
try {
    aplicacion = new AplicacionCalculadoraIP();
} catch (error) {
    console.error('Error crítico al inicializar la aplicación:', error);
}