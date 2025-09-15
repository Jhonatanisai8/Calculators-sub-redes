/**
 * Módulo Calculadora de Subredes
 * Contiene toda la lógica para realizar cálculos de subredes IP
 */
class CalculadoraSubredes {
    /**
     * Convierte una dirección IP a su representación numérica
     * @param {string} ip - Dirección IP en formato string
     * @returns {number} - Representación numérica de la IP
     */
    static ipANumero(ip) {
        const octetos = ip.split('.').map(Number);
        return (octetos[0] << 24) + (octetos[1] << 16) + (octetos[2] << 8) + octetos[3];
    }

    /**
     * Convierte un número a dirección IP
     * @param {number} numero - Número a convertir
     * @returns {string} - Dirección IP en formato string
     */
    static numeroAIp(numero) {
        return [
            (numero >>> 24) & 255,
            (numero >>> 16) & 255,
            (numero >>> 8) & 255,
            numero & 255
        ].join('.');
    }

    /**
     * Calcula la máscara de subred basada en el número de hosts requeridos
     * @param {number} hosts - Número de hosts requeridos
     * @returns {string} - Máscara de subred en formato string
     */
    static calcularMascaraDesdeHosts(hosts) {
        // Calcular bits necesarios para hosts (incluyendo red y broadcast)
        const bitsHost = Math.ceil(Math.log2(hosts + 2));
        const bitsRed = 32 - bitsHost;

        // Crear máscara binaria
        const mascaraBinaria = '1'.repeat(bitsRed) + '0'.repeat(bitsHost);

        // Convertir a formato decimal por octetos
        const octetos = [];
        for (let i = 0; i < 4; i++) {
            const octetoBinario = mascaraBinaria.substr(i * 8, 8);
            octetos.push(parseInt(octetoBinario, 2));
        }

        return octetos.join('.');
    }

    /**
     * Calcula el número de hosts disponibles desde una máscara de subred
     * @param {string} mascara - Máscara de subred
     * @returns {number} - Número de hosts disponibles
     */
    static calcularHostsDesdeMascara(mascara) {
        const octetos = mascara.split('.').map(Number);
        const mascaraBinaria = octetos.map(octeto =>
            octeto.toString(2).padStart(8, '0')
        ).join('');

        const bitsHost = mascaraBinaria.split('').filter(bit => bit === '0').length;
        return Math.pow(2, bitsHost) - 2; // -2 para red y broadcast
    }

    /**
     * Calcula la IP de red aplicando la máscara a la IP dada
     * @param {string} ip - Dirección IP
     * @param {string} mascara - Máscara de subred
     * @returns {string} - IP de red
     */
    static calcularIpRed(ip, mascara) {
        const ipNum = this.ipANumero(ip);
        const mascaraNum = this.ipANumero(mascara);
        const redNum = ipNum & mascaraNum;
        return this.numeroAIp(redNum);
    }

    /**
     * Calcula la IP de broadcast para la subred
     * @param {string} ipRed - IP de red
     * @param {string} mascara - Máscara de subred
     * @returns {string} - IP de broadcast
     */
    static calcularIpBroadcast(ipRed, mascara) {
        const redNum = this.ipANumero(ipRed);
        const mascaraNum = this.ipANumero(mascara);
        const broadcastNum = redNum | (~mascaraNum >>> 0);
        return this.numeroAIp(broadcastNum);
    }

    /**
     * Calcula el primer host válido de la subred
     * @param {string} ipRed - IP de red
     * @returns {string} - Primera IP de host válida
     */
    static calcularPrimerHost(ipRed) {
        const redNum = this.ipANumero(ipRed);
        return this.numeroAIp(redNum + 1);
    }

    /**
     * Calcula el último host válido de la subred
     * @param {string} ipBroadcast - IP de broadcast
     * @returns {string} - Última IP de host válida
     */
    static calcularUltimoHost(ipBroadcast) {
        const broadcastNum = this.ipANumero(ipBroadcast);
        return this.numeroAIp(broadcastNum - 1);
    }

    /**
     * Calcula el gateway predeterminado (primer host de la subred)
     * @param {string} ipRed - IP de red
     * @returns {string} - IP del gateway
     */
    static calcularGateway(ipRed) {
        return this.calcularPrimerHost(ipRed);
    }

    /**
     * Obtiene información adicional sobre la subred
     * @param {string} mascara - Máscara de subred
     * @returns {object} - Información adicional de la subred
     */
    static obtenerInfoAdicional(mascara) {
        const octetos = mascara.split('.').map(Number);
        const mascaraBinaria = octetos.map(octeto =>
            octeto.toString(2).padStart(8, '0')
        ).join('');

        const bitsRed = mascaraBinaria.split('').filter(bit => bit === '1').length;
        const bitsHost = 32 - bitsRed;
        const numeroSubredes = Math.pow(2, bitsRed - 8); // Asumiendo clase C por defecto

        return {
            notacionCIDR: bitsRed,
            bitsRed: bitsRed,
            bitsHost: bitsHost,
            numeroSubredes: numeroSubredes,
            mascaraBinaria: mascaraBinaria
        };
    }

    /**
     * Realiza el cálculo completo de la subred y retorna un objeto ResultadoIp
     * @param {string} ip - Dirección IP
     * @param {string} mascara - Máscara de subred
     * @returns {ResultadoIp} - Objeto con todos los resultados del cálculo
     */
    static calcularSubredCompleta(ip, mascara) {
        // Calcular todos los valores de la subred
        const ipRed = this.calcularIpRed(ip, mascara);
        const ipBroadcast = this.calcularIpBroadcast(ipRed, mascara);
        const primerHost = this.calcularPrimerHost(ipRed);
        const ultimoHost = this.calcularUltimoHost(ipBroadcast);
        const gateway = this.calcularGateway(ipRed);
        const totalHosts = this.calcularHostsDesdeMascara(mascara);

        // Crear y retornar una instancia de ResultadoIp
        return new ResultadoIp(
            ipRed,
            mascara,
            ipBroadcast,
            primerHost,
            ultimoHost,
            gateway,
            totalHosts
        );
    }

    /**
     * Calcula la subred basándose en el número de hosts requeridos
     * @param {string} ip - Dirección IP
     * @param {number} hosts - Número de hosts requeridos
     * @returns {ResultadoIp} - Objeto con todos los resultados del cálculo
     */
    static calcularSubredPorHosts(ip, hosts) {
        const mascara = this.calcularMascaraDesdeHosts(hosts);
        return this.calcularSubredCompleta(ip, mascara);
    }

    /**
     * Calcula subred desde hosts requeridos
     * @param {string} ip - Dirección IP base
     * @param {number} hosts - Número de hosts requeridos
     * @returns {Object} - Información completa de la subred
     */
    static calcularDesdeHosts(ip, hosts) {
        return this.calcularSubredPorHosts(ip, hosts);
    }

    /**
     * Calcula subred desde máscara
     * @param {string} ip - Dirección IP base
     * @param {string} mascara - Máscara de subred
     * @returns {Object} - Información completa de la subred
     */
    static calcularDesdeMascara(ip, mascara) {
        return this.calcularSubredCompleta(ip, mascara);
    }

    /**
     * Calcula múltiples subredes dividiendo una red principal
     * @param {string} ip - Dirección IP de la red principal
     * @param {string} mascara - Máscara de la red principal
     * @param {number} numeroSubredes - Número de subredes a crear
     * @returns {Array<ResultadoIp>} - Array con los resultados de todas las subredes
     */
    static dividirEnSubredes(ip, mascara, numeroSubredes) {
        const subredes = [];

        // Calcular bits adicionales necesarios para las subredes
        const bitsAdicionales = Math.ceil(Math.log2(numeroSubredes));
        const infoActual = this.obtenerInfoAdicional(mascara);
        const nuevaBitsRed = infoActual.bitsRed + bitsAdicionales;

        if (nuevaBitsRed > 30) {
            throw new Error('No es posible crear tantas subredes con hosts válidos');
        }

        // Crear nueva máscara
        const nuevaMascaraBinaria = '1'.repeat(nuevaBitsRed) + '0'.repeat(32 - nuevaBitsRed);
        const nuevaMascara = [];
        for (let i = 0; i < 4; i++) {
            const octetoBinario = nuevaMascaraBinaria.substr(i * 8, 8);
            nuevaMascara.push(parseInt(octetoBinario, 2));
        }
        const mascaraSubred = nuevaMascara.join('.');

        // Calcular el tamaño de cada subred
        const tamañoSubred = Math.pow(2, 32 - nuevaBitsRed);
        const redPrincipal = this.ipANumero(this.calcularIpRed(ip, mascara));

        // Generar cada subred
        for (let i = 0; i < numeroSubredes; i++) {
            const ipSubred = this.numeroAIp(redPrincipal + (i * tamañoSubred));
            const resultado = this.calcularSubredCompleta(ipSubred, mascaraSubred);
            subredes.push(resultado);
        }

        return subredes;
    }

    /**
     * Verifica si una IP está dentro de una subred específica
     * @param {string} ip - IP a verificar
     * @param {string} ipRed - IP de red de la subred
     * @param {string} mascara - Máscara de la subred
     * @returns {boolean} - True si la IP está en la subred
     */
    static ipEstaEnSubred(ip, ipRed, mascara) {
        const ipNum = this.ipANumero(ip);
        const redNum = this.ipANumero(ipRed);
        const mascaraNum = this.ipANumero(mascara);

        return (ipNum & mascaraNum) === redNum;
    }

    /**
     * Calcula la siguiente subred disponible
     * @param {string} ipRed - IP de red actual
     * @param {string} mascara - Máscara de subred
     * @returns {string} - IP de la siguiente subred
     */
    static calcularSiguienteSubred(ipRed, mascara) {
        const redNum = this.ipANumero(ipRed);
        const mascaraNum = this.ipANumero(mascara);
        const tamañoSubred = (~mascaraNum >>> 0) + 1;

        return this.numeroAIp(redNum + tamañoSubred);
    }

    /**
     * Optimiza una lista de subredes para encontrar la máscara más eficiente
     * @param {Array<number>} listaHosts - Array con el número de hosts requeridos por subred
     * @returns {Array<object>} - Array con las subredes optimizadas
     */
    static optimizarSubredes(listaHosts) {
        // Ordenar de mayor a menor para optimizar el uso del espacio
        const hostsOrdenados = [...listaHosts].sort((a, b) => b - a);
        const subredesOptimizadas = [];

        hostsOrdenados.forEach((hosts, index) => {
            const mascara = this.calcularMascaraDesdeHosts(hosts);
            const info = this.obtenerInfoAdicional(mascara);

            subredesOptimizadas.push({
                indice: index,
                hostsRequeridos: hosts,
                hostsDisponibles: this.calcularHostsDesdeMascara(mascara),
                mascara: mascara,
                notacionCIDR: info.notacionCIDR,
                eficiencia: (hosts / this.calcularHostsDesdeMascara(mascara) * 100).toFixed(2) + '%'
            });
        });

        return subredesOptimizadas;
    }
}

// Exportar la clase para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculadoraSubredes;
}