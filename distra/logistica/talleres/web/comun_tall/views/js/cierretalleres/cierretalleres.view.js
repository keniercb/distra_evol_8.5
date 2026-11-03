Ext.ns('log.lb.cierretalleres');

log.lb.cierretalleres.View = Ext.extend(Log.lb.cierre.View, {
    usuarios: undefined,
    documentos: undefined,
    idayuda: 'idcierretalleres',
    constructor: function (config) {
        config.idioma ={};
        LOG.util.UIManager.apply(config.idioma, Log.lb.cierre.Idioma);

        this.dirController = '/logistica/talleres/comun_tall/index.php/gestcierretalleres';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosPendiente';
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.busquedaBasica = true;
        log.lb.cierretalleres.View.superclass.constructor.call(this, config);
    },

    initDefaultColumns: function () {
        log.lb.cierretalleres.View.superclass.initDefaultColumns.call(this);
        var _this = this;
        this.insertGridColumn({
            header: this.idioma.cgProductos,
            width: 90,
            dataIndex: 'cantproductos',
            default: true
        },3);
        
         this.insertGridColumn({
            header: this.idioma.cgServicios,
            width: 90,
            dataIndex: 'cantservicios',
            default: true
        },4);
    }

    
});