/*
 * Clase modelo para el componente Ahp.
 * @author ammejias
 * fecha de creación 14/05/2015
 * @version 1.0
 */
function DatMatrizdofa() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del proyecto dofa", type: "Number", pk: true, index: "idestudiomatrizdofa", notNull: false},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: true}

        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        updUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        delUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        findUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        findByUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa"
    });
}


function DatMatrizdofaModel() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador de la matriz dofa", type: "Number", pk: true, index: "idmatrizdofa", notNull: false},
            {name: "Identificador del estudio de la matriz", type: "Number", pk: false, index: "idestudiomatrizdofa", notNull: true},
            {name: "Identificador de la persona", type: "Number", pk: false, index: "idpersona", notNull: true},
            {name: "identificador del ambito dofa", type: NomAmbitoDofa, fk: [{local: 'idambitodofa', foreing: 'idambitodofa'}], index: "NomAmbitoDofa"},
            {name: "Denominacion", type: "Number", pk: false, index: "denominacion", notNull: true},
            {name: "Analista", type: "Boolean", pk: false, index: "analista", notNull: true}

        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/adicionarmodificarfactor",
        updUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        delUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        findUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        findByUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa"
    });
}
function NomAmbitoDofa() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del ambito", type: "Number", pk: true, index: "idambitodofa", notNull: false},
            {name: "Denominacion", type: "Number", pk: false, index: "denominacion", notNull: true},
            {name: "Descripcion", type: "Number", pk: false, index: "descripcion", notNull: true},
            {name: "Fecha Inicio", type: "Date", index: "fechaini", notNull: false},
            {name: "Fecha Fin", type: "Date", index: "fechafin", notNull: false}
        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        updUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        delUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        findUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa",
        findByUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/getproyectodofa"
    });
}

function DatCriterioEstrategia() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador de la estrategia", type: "Number", pk: true, index: "idestrategia", notNull: false},
            {name: "Identificador del criterio", type: "Number", pk: true, index: "idcriterio", notNull: false}
        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/savecruce",
        delUrl: "/planificacion/herramientasintegracion/index.php/matrizdofa/delcruce"
    });
};