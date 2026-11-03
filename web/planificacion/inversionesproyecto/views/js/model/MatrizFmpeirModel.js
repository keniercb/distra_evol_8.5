/*
 * Clase modelo para el componente Ahp.
 * @author ammejias
 * fecha de creación 14/05/2015
 * @version 1.0
 */
function DatFmpeirmatriz() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "", type: "Number", pk: false, index: "idelementopeir", notNull: false},
            {name: "", type: "Number", pk: false, index: "idfuerzamotriz", notNull: false},
            {name: "", type: "Number", pk: false, index: "idproyecto", notNull: false},
            {name: "", type: "string", pk: false, index: "narchivo", notNull: false},
            {name: "", type: "string", pk: false, index: "farchivo", notNull: false},
            {name: "", type: "Number", pk: false, index: "valor", notNull: false}

        ],
        insUrl: Planificacion.Integracion.UrlModulo + 'fmpeirmatriz/adicionarmatrizlogica',
        updUrl: Planificacion.Integracion.UrlModulo +  '',
        delUrl: Planificacion.Integracion.UrlModulo + '',
    });
}
;