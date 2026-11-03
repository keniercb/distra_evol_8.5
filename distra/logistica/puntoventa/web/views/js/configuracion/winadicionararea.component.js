Ext.ns('LOG.fac.configuracionpuntoventa');
LOG.fac.configuracionpuntoventa.winAdicionarArea = Ext.extend(LOG.util.UITemplate, {
    doAction: false,
    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        this.busquedaBasica = true;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa';
        this.urlBusquedaGridPrincipal = 'cargarAreaCaja';
        this.modoSeleccion = 3;
        this.formaVisualizacion = 'ventana';
        this.idComponent = 'wAddArea';
        this.concepto = config.idioma.ttBtnBuscarArea;
        this.textBusquedaSimple = config.idioma.ttConceptoCodigoDenominacionArea;
        LOG.fac.configuracionpuntoventa.winAdicionarArea.superclass.constructor.call(this, config);
        this.modelo = new LOG.fac.configuracionpuntoventa.Model({
            idioma: config.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/'
        });
        this.getVistaPrincipal().title = this.idioma.tlVentanaAdicionarareas;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.lbCodigoDenom,
            dataIndex: 'coddenominacion',
            autoExpand: true,
            default: true
        });
    },
    initDefaultButtons: function () {
        var me = this;
        //this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
            disabled: true,
            handler: function () {
                var sm = me.smGridPrincipal.selections.items;
                var _areas = [];
                Ext.each(sm, function (rec) {
                    _areas.push({
                        idestructuraop: rec.json.DatEstructuraop[0].idestructuraop,
                        idestructuracomun: idEntidad,
                        activo: 0,
                        diashabiles: 0
                    });
                });
                var params = {
                    datos: Ext.encode(_areas),
                    areaVenta: true
                };
                me.modelo.salvar(params, function (r) {
                    //me.getVistaPrincipal().close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                var sm = me.smGridPrincipal.selections.items;
                var _areas = [];
                Ext.each(sm, function (rec) {
                    _areas.push({
                        idestructuraop: rec.json.DatEstructuraop[0].idestructuraop,
                        idestructuracomun: idEntidad,
                        activo: 0,
                        diashabiles: 0
                    });
                });
                var params = {
                    datos: Ext.encode(_areas),
                    areaVenta: true
                };
                me.modelo.salvar(params, function (r) {
                    me.getVistaPrincipal().close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
    },
    render: function () {
        var me = this;
        var vista = LOG.fac.configuracionpuntoventa.winAdicionarArea.superclass.render.call(this);
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function (e) {
            if (this.getCount() > 0) {
                me.getVistaPrincipal().listaBotones.getItem(2).enable();
            } else {
                me.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        }, 'CNTRLBTN');
        return vista;
    }
});
