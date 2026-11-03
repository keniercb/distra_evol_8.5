/**
 * Clase modelo para el componente Curvaconflicto
 *
 * @author Ing. Frank David Corona Prendes
 * @copyright XETID Cuba
 * @version 1.0
 */
function DatCurvaconflicto() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del proyecto curva conflicto", type: "Number", pk: true, index: "idestudiocurvaconflicto", notNull: true},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Denominación del proyecto curva de conflicto", type: "String", pk: false, index: "denominacion", notNull: false},
            {name: "Fecha inicio", type: "Date", pk: false, index: "fechainicio", notNull: false},
            {name: "Fecha fin", type: "Date", pk: false, index: "fechafin", notNull: false},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: true},
            {name: "Escala", type: "Boolean", pk: false, index: "escala", notNull: false},
            {name: "From problema", type: "Boolean", pk: false, index: "fromproblema", notNull: false},
            {name: "Fecha intermedia", type: "Date", pk: false, index: "fechaintermedia", notNull: false},
            {name: "Fecha avanzada", type: "Date", pk: false, index: "fechaavanzada", notNull: false},
            {name: "Descripcion", type: "String", pk: false, index: "descripcion", notNull: false}
        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/curvaconflicto/saveproyectocurvaconflicto",
        updUrl: "/planificacion/herramientasintegracion/index.php/curvaconflicto/saveproyectocurvaconflicto",
        delUrl: "/planificacion/herramientasintegracion/index.php/curvaconflicto/eliminarproyectocurvaconflicto",
        findUrl: "/planificacion/herramientasintegracion/index.php/curvaconflicto/getproyectocurvaconflicto",
        findByUrl: "/planificacion/herramientasintegracion/index.php/curvaconflicto/getproyectocurvaconflicto"
    });
}