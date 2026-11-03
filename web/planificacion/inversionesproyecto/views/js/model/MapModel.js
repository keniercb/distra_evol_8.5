/**
 * Clase modelo para el componente Map
 *
 * @author Ing. Frank David Corona Prendes
 * @copyright XETID Cuba
 * @version 1.0
 */
function DatMap() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del proyecto modelo analisis politico", type: "Number", pk: true, index: "idestudiomatrizdanalisispolitico", notNull: true},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Denominación del proyecto modelo analisis politico", type: "String", pk: false, index: "denominacion", notNull: false},
            {name: "Resultado", type: "String", pk: false, index: "resultado", notNull: false},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: false}
        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/map/saveproyectomap",
        updUrl: "/planificacion/herramientasintegracion/index.php/map/saveproyectomap",
        delUrl: "/planificacion/herramientasintegracion/index.php/map/eliminarproyectomap",
        findUrl: "/planificacion/herramientasintegracion/index.php/map/getproyectomap",
        findByUrl: "/planificacion/herramientasintegracion/index.php/map/getproyectomap"
    });
};