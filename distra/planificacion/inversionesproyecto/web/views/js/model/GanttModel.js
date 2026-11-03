function DatGantt() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del proyecto modelo diagrama de Gantt", type: "Numeric", pk: true, index: "idestudiogantt", notNull: true},
            {name: "Identificador del proyecto", type: "Number", pk: false, index: "idproyecto", notNull: true},
            {name: "Denominación del proyecto diagrama de Gantt", type: "String", pk: false, index: "denominacion", notNull: false},
            {name: "Nativo", type: "Boolean", pk: false, index: "nativo", notNull: false}
        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/gantt/saveproyectogantt",
        updUrl: "/planificacion/herramientasintegracion/index.php/gantt/saveproyectogantt",
        delUrl: "/planificacion/herramientasintegracion/index.php/gantt/eliminarproyectogantt",
        findUrl: "/planificacion/herramientasintegracion/index.php/gantt/getproyectogantt",
        findByUrl: "/planificacion/herramientasintegracion/index.php/gantt/getproyectogantt"
    });
}

function DatTareagantt() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador de la tarea", type: "Numeric", pk: true, index: "idtareagantt", notNull: true},
            {name: "Identificador del estudio", type: "Numeric", pk: false, index: "idestudiogantt", notNull: true},
            {name: "Identificador de la tarea predecesora", type: "Numeric", pk: false, index: "idpadre", notNull: false},
            {name: "Denominacion de la tarea", type: "String", pk: false, index: "denominacion", notNull: true},
            {name: "Descripcion de la tarea", type: "String", pk: false, index: "descripcion", notNull: false},
            {name: "Duracion de la tarea", type: "Numeric", pk: false, index: "duraciontarea", notNull: true},
            {name: "Porciento de cumplimiento de la tarea", type: "Numeric", pk: false, index: "porcientocumplimiento", notNull: true},
            {name: "Fecha de inicio de la tarea", type: "String", pk: false, index: "fechaini", notNull: true},
            {name: "Fecha fin de la tarea", type: "String", pk: false, index: "fechafin", notNull: true},
            {name: "Identificador de la unidad de tiempo", type: "Numeric", pk: false, index: "idunidadtiempo", notNull: true}
        ],
        insUrl: "/planificacion/herramientasintegracion/index.php/gantt/adicionarTarea",
        updUrl: "/planificacion/herramientasintegracion/index.php/gantt/modificarTarea",
        delUrl: "/planificacion/herramientasintegracion/index.php/gantt/eliminarTarea",
        findUrl: "/planificacion/herramientasintegracion/index.php/gantt/buscarTarea"
    });
}