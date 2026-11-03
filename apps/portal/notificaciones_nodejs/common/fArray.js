/**
 * Creado por Danilo Milán Araujo
 */
function fArray(){
    /*
     * Buscar un elemento en un arreglo
     * @params valor --- Valor a ser buscado
     * @params arreglo Array --- Arreglo donde se buscará el elemento
     * @return Integer --- Si encuentra el elemento devuelve el index sino -1
     */
    this.indexOf = function(valor, arreglo){
        for(var i = 0; i< arreglo.length; i++){
            if(arreglo[i] == valor){
                return i;
            }
        }
        return -1;
    };
    /*
     * Verifica si existe un elemento en un arreglo
     * @params valor --- Valor a ser buscado
     * @params arreglo Array --- Arreglo donde se buscará el elemento
     * @return bool --- True si se encuentra el elemento , False en caso contrario
     */
    this.existe = function(valor, arreglo){
        return this.indexOf(valor, arreglo) != -1;
    };
    /*
     * Obtener los elementos comunes entre dos arreglos
     * @params a Array--- Arreglo
     * @params b Array--- Arreglo
     * @return Array --- Elementos comunes entre los dos arreglos
     */
    this.union = function(a, b){
        var r = [];
        for(var i = 0; i< a.length; i++){
            if(this.existe(a[i], b))
                r.push(a[i]);
        }
        return r;
    };
    /*
     * Verificar si existen elementos comunes entre dos arreglos
     * @params a Array--- Arreglo
     * @params b Array--- Arreglo
     * @return bool --- True si existen elementos comunes entre los arreglo, False en caso contrario
     */
    this.interseccion = function(a, b){
        var r = this.union(a, b);
        return r.length > 0;
    };
}
module.exports = new fArray();