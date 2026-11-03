Ext.ns('LOG.fact');
LOG.fact.winServActv = Ext.extend(LOG.util.UITabTemplate, {
    constructor: function(config) {
        this.idioma = config.idioma;
        LOG.fact.winServActv.superclass.constructor.call(this, config);
    }
});

LOG.fact.GridServActiv = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.idseleccionados = config.idseleccionados;
        this.iddocumento = config.iddocumento;
        this.tipoDoc = config.tipoDoc;
        switch (config.idComponent) {
            case 0:
                this.urlBusquedaGridPrincipal = '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador';
                break;
            case 1:
                this.urlBusquedaGridPrincipal = 'cargarActividades';
                break;
            case 2:
                this.urlBusquedaGridPrincipal = 'cargarAft';
                break;
        }
        LOG.fact.GridServActiv.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: (_this.idComponent != 1 )?'idindicador':'idactividad',
            default: true
        });
        if(_this.idComponent == 0){
            this.addGridColumn({
                header: this.idioma.cmHabilitado,
                width: 100,
                dataIndex: 'activo',
                default: true,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'log-activo';
                    } else {
                        metaData.css = 'log-inactivo';
                    }
                    return '';
                }
            });
        }
        this.addGridColumn({
            header: this.idioma.cmCodigo,
            width: 100,
            dataIndex: (_this.idComponent != 2) ? 'codigoproveedor' : 'nromatricula',
            default: true,
            filter : {
                type : 'string',
                emptyText : 'Codigo',
                dataIndex : (_this.idComponent != 2) ? 'codigoproveedor' : 'nromatricula'
            }
        });
        this.addGridColumn({
            header: this.idioma.cmDenominacion,
            width: 100,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        if (_this.idComponent == 2) {
            this.addGridColumn({
                header: 'Indicativo',
                width: 100,
                dataIndex: 'indicativo',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Indicativo',
                    dataIndex : 'indicativo'
                }
            });
            this.addGridColumn({
                header: 'Nro. Inventario',
                width: 100,
                dataIndex: 'nroinventario',
                default: true,
                filter : {
                    type : 'string',
                    emptyText : 'Nro. Inventario',
                    dataIndex : 'nroinventario'
                }
            });
            this.addGridColumn({
                header: 'Centro costo',
                width: 100,
                dataIndex: 'centrocosto',
                default: true
            });
            this.addGridColumn({
                header: 'Entidad',
                width: 100,
                dataIndex: 'entidad',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idestructuracomun',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idcentrocosto',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idregnumerico',
                default: true
            });
        }
        if(_this.idComponent == 0){
            this.addGridColumn({
                header: this.idioma.cmTarifa,
                width: 100,
                dataIndex: 'precio',
                default: true
            });
            this.addGridColumn({
                header: this.idioma.cmNaturaleza,
                width: 100,
                dataIndex: 'naturaleza',
                default: true
            });
        }

    },
    render: function() {
        var render = LOG.fact.GridServActiv.superclass.render.call(this);
        var _this = this;
        if(_this.idComponent == 0){
            LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
                //idEspecialidad: 1,
                tipo: 2,
                activo: 1,
                idnaturaleza: (_this.tipoDoc == 8) ? Ext.encode(idnaturaleza) : null,
                idseleccionados: _this.idseleccionados
            });
        }else{
            LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
                idseleccionados: _this.idseleccionados,
                iddocumento: _this.iddocumento
            });
        }
        this.getStorePrincipal().load();
        return render;
    }
});
