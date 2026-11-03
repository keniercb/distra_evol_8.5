/**
 * Creado por Danilo Milán Araujo
 * Funciones que se añaden o sobreescriben
 */
(module.exports = function() {
    /*
     * Convertir un objeto a arreglo
     * @return void --- El arreglo con los valores del objeto
     */
    /*Object.prototype.toArray1 = function(){
        console.log(this);
        var result = [];
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                result.push(this[prop]);
            }
        }
        return result;
    };*/
    objectToArray = function(objeto){
        var result = [];
        for (var prop in objeto) {
            if (objeto.hasOwnProperty(prop)) {
                result.push(objeto[prop]);
            }
        }
        return result;
    };
    /*
     * Ordenar un arreglo de objetos por una propiedad específica
     * @params prop String --- La propiedad por la que se ordenará el arreglo
     * @return void --- El arreglo quedará ordenado
     */
    Array.prototype.sortByProperty = function(prop){
        this.sort(function(a, b) {
            if(typeof a === 'object' || typeof a === '[object Object]'){
                if (a[prop] < b[prop])
                    return -1;
                if (a[prop] > b[prop])
                    return 1;
                return 0;
            }
        });
    };
    /*
     * Adicionar un arreglo de elementos a un arreglo
     * @params {Array} arreglo --- Arreglo a ser adicionado al arreglo
     * @return void --- Al arreglo se le habrán adicionado los elementos
     */
    Array.prototype.adicionarElementos = function(arreglo){
        var me = this;
        arreglo.forEach(function(item){
            me.push(item);
        });
    };
    /*
     * Adicionar los elementos de un arreglo que no esten en el arreglo
     * @params {Array} arreglo --- Arreglo a ser adicionado al arreglo
     * @params {String} prop --- Propiedad que no puede repetirse en el arreglo de objetos
     * @return void --- Al arreglo se le habrán adicionado los elementos que no existian
     */
    Array.prototype.adicionarObjetosNoExistentes = function(arreglo, prop){
        var me = this;
        arreglo.forEach(function(item){
            if(!me.estaObjecto(prop, item[prop])){
                me.push(item);
            }
        });
    };
    /*
     * Comprobar si existe un objeto dentro de un arreglo segun el valor de una propiedad del objeto
     * @params {String} prop --- Propiedad del objeto por la cual se buscara
     * @params {String} value --- Valor que se buscara
     * @retunr {bool} --- True si el objeto esta dentro del arreglo o False si no lo encuentra
     */
    Array.prototype.estaObjecto = function(prop, value){
        return this.obtenerIndexObjecto(prop, value) != -1;
    };
    /*
     * Obtener la posicion de un objeto dentro de un arreglo segun el valor de una propiedad del objeto
     * @params {String} prop --- Propiedad del objeto por la cual se buscara
     * @params {String} value --- Valor que se buscara
     * @retunr {Integer} --- Posicion del objeto dentro del arreglo o -1 si no lo encuentra
     */
    Array.prototype.obtenerIndexObjecto = function(prop, value){
        for(var i = 0; i < this.length; i++){
            if(this[i][prop] == value)
                return i;
        }
        return -1;
    };
    /*
     * Obtener la suma de los valores de un atributo dentro de un arreglo segun el valor de un atributo
     * @params {String} prop --- Propiedad del objeto la cual se sumara
     * @retunr {Numeric} --- Suma de los valores de la propiedad
     */
    Array.prototype.sumaInt = function(prop){
        var suma = 0;
        this.forEach(function(item){
            suma+=parseInt(item[prop]);
        });
        return suma;
    };
    /*
     * Obtener la suma de los valores de un arreglo si estos son numericos
     * @return {Numeric} --- Suma de los valores del arreglo
     */
    Array.prototype.suma = function(){
        var suma = 0;
        this.forEach(function(item){
            suma+=parseInt(item);
        });
        return suma;
    };
    /*
     * Sustituir valores en una cadena con el formato "algo {0} as {1}"
     * @params Array o varios parametros --- Los parametros sustituiran los {#} en el orden que aparezcan
     * ejemplo con array ---
     *              cadena =  "Cantidad {0} de {1} posibles"
     *              Syntaxis --- cadena.format([2, 10])
     *              Resultado --- Cantidad 2 de 10 posibles"
     * ejemplo con varios parametos ---
     *              cadena =  "Cantidad {0} de {1} posibles"
     *              Syntaxis --- cadena.format(2, 10)
     *              Resultado --- Cantidad 2 de 10 posibles"
     * @return cadena con los valores sustituidos
     */
    String.prototype.format = function(params){
        if(!Array.isArray(params)){
            params = objectToArray(arguments);
        }
        var formatRe = /\{(\d+)\}/g;
        return this.replace(formatRe, function(m, i) {
            return params[i];
        });
    };


})();