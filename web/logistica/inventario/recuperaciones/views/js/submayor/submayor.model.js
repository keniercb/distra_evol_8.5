Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.Model = Ext.extend(LOG.util.Model, {

    listaDocumentos: undefined,
    confinventario: undefined,

    constructor: function(config) {
        this.listaDocumentos = new LOG.util.List();
        config.fields = [{
            name: 'iddproducto',
            primary: true
        }, {
            name: 'denominacion'
        }];
        LOG.inv.submayor.Model.superclass.constructor.call(this, config);
    },
    mostrarTarjeta: function(_params, _fn) {
        var _this = this;
        _params.url = '/logistica/inventario/recuperaciones/index.php/submayorinventario/mostrarTarjeta';
        this.cargaInicial(_params, _fn);
    },
    
    cerrarAlmacen : function(_params, _fn){
        _params.url = '/logistica/inventario/recuperaciones/index.php/submayorinventario/cerrarAlmacen';
        this.cargaInicial(_params, _fn, this.idioma.msgCerrarandAlm);
    },
    cerrarDiaAlmacen : function(_params, _fn){
        _params.url = '/logistica/inventario/recuperaciones/index.php/submayorinventario/cerrarDiaAlmacen';
        this.cargaInicial(_params, _fn, this.idioma.ttBtnCierreDia);
    }
});