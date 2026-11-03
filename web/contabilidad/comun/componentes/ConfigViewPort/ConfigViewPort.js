Ext.ns('Ext.Contabilidad');

Ext.Contabilidad.ConfigViewPort = Ext.extend(Ext.Component, {
    viewport: undefined,
    nomenclador: undefined,
    mostrador: undefined,
    constructor: function () {
        Ext.Contabilidad.ConfigViewPort.superclass.constructor.call(this);
        this.crearFunciones();
    },
    crearViewPort: function () {
        this.viewport = new Ext.Viewport({
            layout: 'border',
            items: [this.getNomenclador(), this.getMostrador()]
        });
    },
    setNomenclador: function (nomenclador) {
        this.nomenclador = nomenclador;
        this.nomenclador.on({
            seleccion: this.agregarItemMostrador
        });
        return this;
    },
    getNomenclador: function () {
        return this.nomenclador;
    },
    setMostrador: function (mostrador) {
        this.mostrador = mostrador;
        return this;
    },
    getMostrador: function () {
        return this.mostrador;
    },
    addConceptos: function (concepto) {
        this.getNomenclador().adicionarItem(concepto);
        return this;
    },
    crearFunciones: function () {
        var _this = this;
        this.agregarItemMostrador = function (item) {
            _this.getMostrador().adicionarItem(item);
        };

    }
});