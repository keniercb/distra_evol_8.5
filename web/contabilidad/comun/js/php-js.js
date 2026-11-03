/**
 * 
 * @returns {Arguments|array_diff.arr1}
 */
function array_diff () {
    // Returns the entries of arr1 that have values which are not present in any of the others arguments.  
    // *     example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']);
    // *     returns 1: {0:'Kevin'}
    var arr1 = arguments[0],
    retArr = Array();
    var k1 = '',
    i = 1,
    k = '',
    arr = {};
        arr1keys: for (k1 in arr1) {
            for (i = 1; i < arguments.length; i++) {
                arr = arguments[i];
                for (k in arr) {
                    if (arr[k] === arr1[k1]) {
                        // If it reaches here, it was found in at least one array, so try next value
                        continue arr1keys;
                    }
                }
                retArr[k1] = arr1[k1];
            }
        }
    return retArr;
}

/* 
 * Convertir un objeto en arreglo asociativo. El nuevo arreglo tendrá todas las propiedades del objeto como indices o llaves y los valores como valores.
 * @param agObject Objeto a convertir.
 * @return Arreglo convertido.
 * @author Ing. Miguel Diaz Riveaux.
 * @package ERP Cuba.
 * @subpackage Contabilidad y Finanzas. 
 * @copyright XETID.
 */
function toArray(agObject){
    var _Array = new Array();
    for(var name in agObject){
        _Array[name] = agObject[name];
    }
    return _Array;
}

/* 
 * Convertir un arreglo asociativo en objeto. El nuevo objeto tendrá todos los índices en arreglos como propiedad y los valores como valores de la propiedad.
 * @param agArray Arreglo a convertir.
 * @return Objeto convertido.
 * @author Ing. Miguel Diaz Riveaux.
 * @package ERP Cuba.
 * @subpackage Contabilidad y Finanzas. 
 * @copyright XETID.
 */
function toObject(agArray){
    var _Object = new Object();
    for(var key in agArray){
        _Object[key] = agArray[key];
    }
    return _Object;
}

function array_intersect () {
    // Returns the entries of arr1 that have values which are present in all the other arguments  
    // 
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/array_intersect
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: These only output associative arrays (would need to be
    // %        note 1: all numeric and counting from zero to be numeric)
    // *     example 1: $array1 = {'a' : 'green', 0:'red', 1: 'blue'};
    // *     example 1: $array2 = {'b' : 'green', 0:'yellow', 1:'red'};
    // *     example 1: $array3 = ['green', 'red'];
    // *     example 1: $result = array_intersect($array1, $array2, $array3);
    // *     returns 1: {0: 'red', a: 'green'}
    var arr1 = arguments[0],
        retArr = {};
    var k1 = '',
        arr = {},
        i = 0,
        k = '';

    arr1keys: for (k1 in arr1) {
        arrs: for (i = 1; i < arguments.length; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    if (i === arguments.length - 1) {
                        retArr[k1] = arr1[k1];
                    }
                    // If the innermost loop always leads at least once to an equal value, continue the loop until done
                    continue arrs;
                }
            }
            // If it reaches here, it wasn't found in at least one array, so try next value
            continue arr1keys;
        }
    }

    return retArr;
}