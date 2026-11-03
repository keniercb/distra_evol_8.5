Ext.ns('log.lb.cierrefacturacion');

log.lb.cierrefacturacion.View = Ext.extend(Log.lb.cierre.View, {
    usuarios: undefined,
    documentos: undefined,
    idayuda: 'idcierrefactura',
    constructor: function (config) {
        config.idioma ={};
        LOG.util.UIManager.apply(config.idioma, Log.lb.cierre.Idioma);

        this.dirController = '/logistica/facturacion/facturacion/comun_fact/index.php/gestcierrefactura';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosPendiente';
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.busquedaBasica = true;
        log.lb.cierrefacturacion.View.superclass.constructor.call(this, config);
    },

    initDefaultColumns: function () {
        log.lb.cierrefacturacion.View.superclass.initDefaultColumns.call(this);
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