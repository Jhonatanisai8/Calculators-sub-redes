/**
 * Módulo Validador
 * Contiene todas las funciones de validación para direcciones IP y máscaras de subred
 */
class Validador {
    /**
     * Valida si una dirección IP es válida (IPv4)
     * @param {string} ip - Dirección IP a validar
     * @returns {boolean} - True si es válida, false en caso contrario
     */
    static esDireccionIPValida(ip) {
        if (!ip || typeof ip !== 'string') {
            return false;
        }

        // Expresión regular para validar IPv4
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        if (!ipRegex.test(ip)) {
            return false;
        }

        // Validación adicional: verificar que no sea una IP reservada problemática
        const octetos = ip.split('.').map(Number);
        
        // No permitir 0.0.0.0
        if (octetos.every(octeto => octeto === 0)) {
            return false;
        }

        // No permitir 255.255.255.255
        if (octetos.every(octeto => octeto === 255)) {
            return false;
        }

        return true;
    }

    /**
     * Valida si una máscara de subred es válida
     * @param {string} mascara - Máscara de subred a validar
     * @returns {boolean} - True si es válida, false en caso contrario
     */
    static esMascaraSubredValida(mascara) {
        if (!this.esDireccionIPValida(mascara)) {
            return false;
        }
        
        const octetos = mascara.split('.').map(Number);
        const mascaraBinaria = octetos.map(octeto => 
            octeto.toString(2).padStart(8, '0')
        ).join('');
        
        // Verificar que la máscara tenga 1s seguidos de 0s (patrón válido)
        const patronMascara = /^1*0*$/;
        return patronMascara.test(mascaraBinaria);
    }

    /**
     * Valida si el número de hosts es válido
     * @param {number|string} hosts - Número de hosts a validar
     * @returns {boolean} - True si es válido, false en caso contrario
     */
    static esNumeroHostsValido(hosts) {
        const numHosts = parseInt(hosts);
        
        // Verificar que sea un número válido
        if (isNaN(numHosts) || numHosts < 1) {
            return false;
        }

        // Verificar que no exceda el máximo teórico (2^24 - 2)
        if (numHosts > 16777214) {
            return false;
        }

        return true;
    }

    /**
     * Valida si una IP está en el rango de direcciones privadas
     * @param {string} ip - Dirección IP a verificar
     * @returns {boolean} - True si es privada, false si es pública
     */
    static esIPPrivada(ip) {
        if (!this.esDireccionIPValida(ip)) {
            return false;
        }

        const octetos = ip.split('.').map(Number);
        const [a, b, c, d] = octetos;

        // Clase A privada: 10.0.0.0/8
        if (a === 10) {
            return true;
        }

        // Clase B privada: 172.16.0.0/12
        if (a === 172 && b >= 16 && b <= 31) {
            return true;
        }

        // Clase C privada: 192.168.0.0/16
        if (a === 192 && b === 168) {
            return true;
        }

        // Loopback: 127.0.0.0/8
        if (a === 127) {
            return true;
        }

        return false;
    }

    /**
     * Valida si una IP es de clase A, B o C
     * @param {string} ip - Dirección IP a clasificar
     * @returns {string|null} - 'A', 'B', 'C' o null si no es válida
     */
    static obtenerClaseIP(ip) {
        if (!this.esDireccionIPValida(ip)) {
            return null;
        }

        const primerOcteto = parseInt(ip.split('.')[0]);

        if (primerOcteto >= 1 && primerOcteto <= 126) {
            return 'A';
        } else if (primerOcteto >= 128 && primerOcteto <= 191) {
            return 'B';
        } else if (primerOcteto >= 192 && primerOcteto <= 223) {
            return 'C';
        } else if (primerOcteto >= 224 && primerOcteto <= 239) {
            return 'D'; // Multicast
        } else if (primerOcteto >= 240 && primerOcteto <= 255) {
            return 'E'; // Experimental
        }

        return null;
    }

    /**
     * Valida si una máscara es apropiada para la clase de IP
     * @param {string} ip - Dirección IP
     * @param {string} mascara - Máscara de subred
     * @returns {boolean} - True si es apropiada, false en caso contrario
     */
    static esMascaraApropiadaParaClase(ip, mascara) {
        const clase = this.obtenerClaseIP(ip);
        
        if (!clase || !this.esMascaraSubredValida(mascara)) {
            return false;
        }

        const octetos = mascara.split('.').map(Number);
        
        switch (clase) {
            case 'A':
                // Clase A: mínimo /8 (255.0.0.0)
                return octetos[0] === 255;
            case 'B':
                // Clase B: mínimo /16 (255.255.0.0)
                return octetos[0] === 255 && octetos[1] === 255;
            case 'C':
                // Clase C: mínimo /24 (255.255.255.0)
                return octetos[0] === 255 && octetos[1] === 255 && octetos[2] === 255;
            default:
                return true; // Para clases D y E, permitir cualquier máscara
        }
    }

    /**
     * Obtiene mensajes de error específicos para validaciones fallidas
     * @param {string} tipo - Tipo de validación ('ip', 'mascara', 'hosts')
     * @param {string} valor - Valor que falló la validación
     * @returns {string} - Mensaje de error descriptivo
     */
    static obtenerMensajeError(tipo, valor) {
        switch (tipo) {
            case 'ip':
                if (!valor || valor.trim() === '') {
                    return 'Por favor, ingresa una dirección IP.';
                }
                if (valor === '0.0.0.0') {
                    return 'La dirección 0.0.0.0 no es válida para cálculos de subred.';
                }
                if (valor === '255.255.255.255') {
                    return 'La dirección 255.255.255.255 es una dirección de broadcast global.';
                }
                return 'Por favor, ingresa una dirección IP válida (ej: 192.168.1.100).';
                
            case 'mascara':
                if (!valor || valor.trim() === '') {
                    return 'Por favor, ingresa una máscara de subred.';
                }
                return 'Por favor, ingresa una máscara de subred válida (ej: 255.255.255.0).';
                
            case 'hosts':
                if (!valor || valor.trim() === '') {
                    return 'Por favor, ingresa el número de hosts.';
                }
                const numHosts = parseInt(valor);
                if (numHosts < 1) {
                    return 'El número de hosts debe ser mayor a 0.';
                }
                if (numHosts > 16777214) {
                    return 'El número de hosts es demasiado grande (máximo: 16,777,214).';
                }
                return 'Por favor, ingresa un número válido de hosts (mínimo 1).';
                
            default:
                return 'Error en la validación de datos.';
        }
    }

    /**
     * Realiza una validación completa de los datos de entrada
     * @param {string} ip - Dirección IP
     * @param {string} tipoEntrada - 'hosts' o 'mascara'
     * @param {string} mascara - Máscara de subred (si aplica)
     * @param {number} numeroHosts - Número de hosts (si aplica)
     * @returns {object} - Objeto con resultado de validación y mensaje de error si aplica
     */
    static validarEntradaCompleta(ip, tipoEntrada, mascara, numeroHosts) {
        // Validar IP
        if (!this.esDireccionIPValida(ip)) {
            return {
                esValido: false,
                mensaje: this.obtenerMensajeError('ip', ip)
            };
        }

        // Validar según tipo de entrada
        if (tipoEntrada === 'hosts') {
            if (!this.esNumeroHostsValido(numeroHosts)) {
                return {
                    esValido: false,
                    mensaje: this.obtenerMensajeError('hosts', numeroHosts)
                };
            }
        } else if (tipoEntrada === 'mascara') {
            if (!this.esMascaraSubredValida(mascara)) {
                return {
                    esValido: false,
                    mensaje: this.obtenerMensajeError('mascara', mascara)
                };
            }
        }

        return {
            esValido: true,
            mensaje: null
        };
    }
}

// Exportar la clase para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validador;
}