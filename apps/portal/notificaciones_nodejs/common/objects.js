/**
 * Created by ariam on 26/06/14.
 */
function objeto () {

    /*Obtiene la cantidad de elementos de un objeto*/
    this.cantidad = function(objeto) {
        var _c = 0,
            _p
        for (_p in objeto) {
            if (objeto.hasOwnProperty(_p)) {
                _c++;
            }
        }
        return _c;
    }

    /*Comprueba si el objeto está vacio o no*/
    this.esVacio = function(objeto){
        var _v = true
        for (var p in objeto) {
            if (objeto.hasOwnProperty(p)) {
                _v = false;
                break;
            }
        }
        return _v;
    }
}
module.exports = new objeto();