Ext.ns('LOG.fact');
LOG.fact.winClientesEstructuras = Ext.extend(LOG.util.UITabTemplate, {
    constructor: function(config) {
        this.idioma = config.idioma;
        LOG.fact.winClientesEstructuras.superclass.constructor.call(this, config);
    }
});

LOG.fact.GridClientesEstructuras = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.modoSeleccion = config.modoSeleccion || 1;
        switch (config.idComponent) {
            case 0:
                this.urlBusquedaGridPrincipal = 'cargarTransportadora';
                break;
            case 1:
                this.urlBusquedaGridPrincipal = 'cargarTransportadora';
                break;
        }
        LOG.fact.GridClientesEstructuras.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: (_this.idComponent == 0 )?'idclientesproveedores':'idclientesproveedores',//cambiar
            default: true
        });
        if(_this.idComponent == 1){
            this.addGridColumn({
                header: this.idioma.cmCodigo,
                width: 100,
                dataIndex: 'codigo',
                default: true
            });
        }
        this.addGridColumn({
            header: ((_this.idComponent == 0)?this.idioma.cmEstructura:this.idioma.cmNombre),
            width: 100,
            dataIndex: ((_this.idComponent == 0)?'text':'nombre'),
            default: true,
            autoExpand: true
        });
    },
    render: function() {
        var render = LOG.fact.GridClientesEstructuras.superclass.render.call(this);
        var _this = this;
        if(_this.idComponent == 0){
            LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
                tipo: 1
            });
        }else{
            LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
                tipo: 2
            });
        }
        this.getStorePrincipal().load();
        return render;
    }
});
