/**
 * Clase ResultadoIp
 * Encapsula todos los resultados obtenidos del cálculo de subredes IP
 */
class ResultadoIp {
    /**
     * Constructor de la clase ResultadoIp
     * @param {string} networkIP - IP de red
     * @param {string} subnetMask - Máscara de subred
     * @param {string} broadcastIP - IP de broadcast
     * @param {string} firstHostIP - Primera IP de host válida
     * @param {string} lastHostIP - Última IP de host válida
     * @param {string} gatewayIP - IP del gateway (predeterminado)
     * @param {number} totalHosts - Total de hosts disponibles
     */
    constructor(networkIP, subnetMask, broadcastIP, firstHostIP, lastHostIP, gatewayIP, totalHosts) {
        this._networkIP = networkIP;
        this._subnetMask = subnetMask;
        this._broadcastIP = broadcastIP;
        this._firstHostIP = firstHostIP;
        this._lastHostIP = lastHostIP;
        this._gatewayIP = gatewayIP;
        this._totalHosts = totalHosts;
    }

    // Getters para acceder a los atributos
    get networkIP() {
        return this._networkIP;
    }

    get subnetMask() {
        return this._subnetMask;
    }

    get broadcastIP() {
        return this._broadcastIP;
    }

    get firstHostIP() {
        return this._firstHostIP;
    }

    get lastHostIP() {
        return this._lastHostIP;
    }

    get gatewayIP() {
        return this._gatewayIP;
    }

    get totalHosts() {
        return this._totalHosts;
    }

    /**
     * Obtiene el rango de hosts como string
     * @returns {string} - Rango de hosts en formato "primera - última"
     */
    getRangoHosts() {
        return `${this._firstHostIP} - ${this._lastHostIP}`;
    }

    /**
     * Obtiene información de la red en formato CIDR
     * @returns {string} - Red en formato CIDR (ej: 192.168.1.0/24)
     */
    getRedCIDR() {
        const cidr = this._calcularCIDR();
        return `${this._networkIP}/${cidr}`;
    }

    /**
     * Calcula la notación CIDR a partir de la máscara de subred
     * @returns {number} - Número de bits de red
     * @private
     */
    _calcularCIDR() {
        const octets = this._subnetMask.split('.').map(Number);
        const binaryMask = octets.map(octet => 
            octet.toString(2).padStart(8, '0')
        ).join('');
        
        return binaryMask.split('').filter(bit => bit === '1').length;
    }

    /**
     * Convierte el objeto a formato JSON para fácil serialización
     * @returns {object} - Objeto con todos los resultados
     */
    toJSON() {
        return {
            networkIP: this._networkIP,
            subnetMask: this._subnetMask,
            broadcastIP: this._broadcastIP,
            firstHostIP: this._firstHostIP,
            lastHostIP: this._lastHostIP,
            gatewayIP: this._gatewayIP,
            totalHosts: this._totalHosts,
            rangoHosts: this.getRangoHosts(),
            redCIDR: this.getRedCIDR()
        };
    }

    /**
     * Convierte el objeto a string para visualización
     * @returns {string} - Representación en string de los resultados
     */
    toString() {
        return `Red: ${this.getRedCIDR()}\n` +
               `Máscara: ${this._subnetMask}\n` +
               `Broadcast: ${this._broadcastIP}\n` +
               `Rango de hosts: ${this.getRangoHosts()}\n` +
               `Gateway: ${this._gatewayIP}\n` +
               `Total hosts: ${this._totalHosts.toLocaleString()}`;
    }

    /**
     * Valida si todos los resultados son válidos
     * @returns {boolean} - True si todos los resultados son válidos
     */
    esValido() {
        return this._networkIP && 
               this._subnetMask && 
               this._broadcastIP && 
               this._firstHostIP && 
               this._lastHostIP && 
               this._gatewayIP && 
               this._totalHosts >= 0;
    }

    /**
     * Crea una instancia de ResultadoIp a partir de un objeto plano
     * @param {object} data - Objeto con los datos del resultado
     * @returns {ResultadoIp} - Nueva instancia de ResultadoIp
     * @static
     */
    static fromObject(data) {
        return new ResultadoIp(
            data.networkIP,
            data.subnetMask,
            data.broadcastIP,
            data.firstHostIP,
            data.lastHostIP,
            data.gatewayIP,
            data.totalHosts
        );
    }

    /**
     * Compara dos resultados de IP para verificar si son iguales
     * @param {ResultadoIp} otroResultado - Otro resultado para comparar
     * @returns {boolean} - True si son iguales
     */
    equals(otroResultado) {
        if (!(otroResultado instanceof ResultadoIp)) {
            return false;
        }

        return this._networkIP === otroResultado._networkIP &&
               this._subnetMask === otroResultado._subnetMask &&
               this._broadcastIP === otroResultado._broadcastIP &&
               this._firstHostIP === otroResultado._firstHostIP &&
               this._lastHostIP === otroResultado._lastHostIP &&
               this._gatewayIP === otroResultado._gatewayIP &&
               this._totalHosts === otroResultado._totalHosts;
    }
}

// Exportar la clase para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultadoIp;
}