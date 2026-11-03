/**
 * Fichero que contiene los objectos modelos del componente Causa y Efecto.
 * 
 * @author ohgonzalez 
 * @version 1.0
 */

function DatEfecto() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador del efecto", type: "Number", pk: true, index: "idefecto", notNull: true},
            {name: "Identificador del estudio", type: "Number", pk: false, index: "idestudiocausaefecto", notNull: true},
            {name: "Denominacion del efecto", type: "String", pk: false, index: "denominacion", notNull: true},
            {name: "Descripcion del efecto", type: "String", pk: false, index: "descripcion", notNull: false}
        ],
        insUrl: Planificacion.Sistemas.UrlModulo + "causaefecto/guardarEfecto",
        updUrl: Planificacion.Sistemas.UrlModulo + "causaefecto/modificarEfecto",
        delUrl: Planificacion.Sistemas.UrlModulo + "causaefecto/eliminarEfecto"
    });
};



