Ext.ns('LOG.lb.ubicacion');

LOG.lb.ubicacion.winPropuestaUbicacion = Ext.extend(LOG.util.Window, {
    listaGridColumnsPropuestaUbicacion: undefined,
    width: 650,
    height: 400,
    usarAplicar: false,
    constructor: function(config) {
        var _this = this;
       
        this.listaGridColumnsPropuestaUbicacion = new LOG.util.List();
        this.listaGridColumnsPropuestaUbicacion.add({
            header: config.idioma.cgUbicacion,
            width: 220,
            dataIndex: 'descripcion',
            default: true
        });

        this.listaGridColumnsPropuestaUbicacion.add({
            header: config.idioma.cgArea,
            width: 120,
            dataIndex: 'area',
            default: true
        });

        this.listaGridColumnsPropuestaUbicacion.add({
            header: config.idioma.cgCantidadUbicada,
            width: 120,
            dataIndex: 'cantubicada',
            default: true
        });

        this.listaGridColumnsPropuestaUbicacion.add({
            header: config.idioma.cgPosiblesUbicar,
            width: 120,
            dataIndex: 'pubicacion',
            default: true
        });

        this.smPropuestaUbicacion = LOG.util.UIManager.initSelectionModel(3);
        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsPropuestaUbicacion);
        this.cmGridPropuestaUbicacion = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridPropuestaUbicacion = Ext.data.Record.create(cls.fields);
        this.stGridPropuestaUbicacion = new Ext.data.Store({
            url: ' cargarPubicacioneProducto',
            initBaseParams: {
                idproducto: config.datos.getSelected().json.idproducto,
                cantidad: config.datos.getSelected().json.cantidad
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridPropuestaUbicacion)
        });
        this.stGridPropuestaUbicacion.load(),
        this.gridPropuestaUbicacion = LOG.util.UIManager.initGrid(this.cmGridPropuestaUbicacion, this.stGridPropuestaUbicacion, this.smPropuestaUbicacion);

        var panelWinPropuestaUbicacion = LOG.util.UIManager.initPanel({
            layout: 'border',
            region: 'center',
            height: 100,
            resizable: false,
            items: [this.gridPropuestaUbicacion]
        });

        config.items = [panelWinPropuestaUbicacion];
        LOG.lb.ubicacion.winPropuestaUbicacion.superclass.constructor.call(this, config);
    }
});