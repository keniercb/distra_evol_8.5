/*
 * Clase modelo para el componente Ahp.
 * @author ammejias
 * fecha de creación 14/05/2015
 * @version 1.0
 */
function DatImpactocruzado() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del estudio Matriz Impacto cruzado", type: "Number", pk: true, index: "idestudiomatrizimpactocruzado", notNull: false},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: false}

        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/saveestudio",
        updUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/saveestudio",
        delUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/eliminarestudio",
        findUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/getestudio",
        findByUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/getestudioimpactocruzado"
    });
};

function DatMatrizImpactoCruzado() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador de la fila", type: "Number", pk: true, index: "idvariablefila", notNull: false},
            {name: "Identificador de la columna", type: "Number", pk: true, index: "idvariablecolumna", notNull: false},
            {name: "Identificador del impacto", type: "Number", pk: false, index: "idimpacto", notNull: false}

        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/savematrizimpactocruzado",
        updUrl: "/planificacion/herramientasintegracion/index.php/impactocruzado/savematrizimpactocruzado"
    });
};