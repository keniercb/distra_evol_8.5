/*
 * Clase modelo para el componente Ahp.
 * @author ammejias
 * fecha de creación 14/05/2015
 * @version 1.0
 */
function DatFmpeir() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "", type: "Number", pk: true, index: "idindicadorfmpeir", notNull: false},
            {name: "", type: "Number", pk: false, index: "idfuente", notNull: false},
            {name: "", type: "Number", pk: false, index: "fuente", notNull: false},
            {name: "", type: "Number", pk: false, index: "idelementopeir", notNull: false},
            {name: "", type: "Number", pk: false, index: "descripcionind", notNull: false},
            {name: "", type: "String", pk: false, index: "denominacion", notNull: false},
            {name: "", type: "String", pk: false, index: "descripcion", notNull: false},
            {name: "", type: "Number", pk: false, index: "idfuerzamotriz", notNull: false}

        ],
        insUrl: Planificacion.Integracion.UrlModulo + 'fmpeir/adicionarIndicador',
        updUrl: Planificacion.Integracion.UrlModulo + 'fmpeir/obtenerIndicador',
        delUrl: Planificacion.Integracion.UrlModulo + 'fmpeir/eliminarIndicador',
    });
}
;