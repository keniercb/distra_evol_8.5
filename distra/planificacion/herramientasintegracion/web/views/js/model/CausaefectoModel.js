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
        insUrl: Planificacion.Integracion.UrlModulo + "causaefecto/guardarEfecto",
        updUrl: Planificacion.Integracion.UrlModulo + "causaefecto/modificarEfecto",
        delUrl: Planificacion.Integracion.UrlModulo + "causaefecto/eliminarEfecto"
    });
};

function DatCategoria() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador de la categoria", type: "Number", pk: true, index: "idcategoria", notNull: true},
            {name: "Identificador del efecto", type: "Number", pk: false, index: "idefecto", notNull: true},
            {name: "Denominacion de la categoria", type: "String", pk: false, index: "denominacion", notNull: true}
        ],
        insUrl: Planificacion.Integracion.UrlModulo + "causaefecto/guardarCategoria",
        updUrl: Planificacion.Integracion.UrlModulo + "causaefecto/modificarCategoria",
        delUrl: Planificacion.Integracion.UrlModulo + "causaefecto/eliminarCategoria"
    });
};

function DatCausa() {
    this.superClass = ViewModel;
    this.superClass({
        fields: [
            {name: "Identificador de la causa", type: "Number", pk: true, index: "idcausa", notNull: true},
            {name: "Identificador de la categoria padre", type: "Number", pk: false, index: "idcategoria", notNull: true},
            {name: "Identificador de la causa padre", type: "Number", pk: false, index: "idpadre", notNull: false},
            {name: "Denominacion de la causa", type: "String", pk: false, index: "denominacion", notNull: true},
            {name: "Identificador de la causa padre", type: "Number", pk: false, index: "lft", notNull: false},
            {name: "Identificador de la causa padre", type: "Number", pk: false, index: "rgt", notNull: false}
        ],
        insUrl: Planificacion.Integracion.UrlModulo + "causaefecto/guardarCausa",
        updUrl: Planificacion.Integracion.UrlModulo + "causaefecto/modificarCausa",
        delUrl: Planificacion.Integracion.UrlModulo + "causaefecto/eliminarCausa"
    });
};


