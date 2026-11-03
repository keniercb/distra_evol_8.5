/*
 * Clase modelo para el componente Ahp.
 * @author ammejias
 * fecha de creación 14/05/2015
 * @version 1.0
 */
function DatMatrizRelaciones() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del proyecto ahp", type: "Number", pk: true, index: "idproyectoahp", notNull: false},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Denominación del proyecto ahp", type: "String", pk: false, index: "denominacion", notNull: false},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: false}

        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/matrizrelaciones/savematrizrelaciones",
        updUrl: "/planificacion/herramientasintegracion/index.php/matrizrelaciones/savematrizrelaciones",
        delUrl: "/planificacion/herramientasintegracion/index.php/matrizrelaciones/eliminarmatrizrelaciones",
        findUrl: "/planificacion/herramientasintegracion/index.php/matrizrelaciones/getmatrizrelaciones",
        findByUrl: "/planificacion/herramientasintegracion/index.php/matrizrelaciones/getmatrizrelaciones"
    });
};