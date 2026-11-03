Ext.ns('Ext.erp.fideicomiso');

Ext.erp.fideicomiso = Ext.extend(LOG.util.UITemplate, {

    constructor: function (config) {
        config.dirController = '/logistica/facturacion/facturacion/recuperaciones/index.php/reportefideicomiso';
        config.urlBusquedaGridPrincipal = 'getFacturaFideicomiso';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        config.idioma = {};
        Ext.erp.fideicomiso.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, {});
    },
    init: function () {
        var _this = this;
        Ext.erp.fideicomiso.superclass.init.call(this);
    },

    render: function (config) {
        var render = Ext.erp.fideicomiso.superclass.render.call(this, config);
        var _this = this;
        _this.tfFactura = LOG.util.Prototipos.inputTexto({
            name: 'numero',
            width: 100,
        });
        _this.tfProducto = LOG.util.Prototipos.inputTexto({
            name: 'product',
            width: 110,
        });
        _this.textDesde = new Ext.form.DateField({
            name: 'desdeLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'desdeLV',
            endDateField: 'hastaLV'
        });
        _this.textHasta = new Ext.form.DateField({
            name: 'hastaLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'hastaLV',
            startDateField: 'desdeLV'
        });
        _this.textDesde.endDateField = _this.textHasta.id;
        _this.textHasta.startDateField = _this.textDesde.id;
        _this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.tooltipBuscar,
            disabled: false,
            handler: function () {
                _this.botonBuscar();
            }
        });
        _this.btnExcel = new Ext.Button({
            iconCls: 'exportar',
            text: this.idioma.lbBtnExcel,
            tooltip: this.idioma.ttBtnExcel,
            disabled: false,
            handler: function () {
                var desde = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d/m/Y') : null;
                var hasta = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d/m/Y') : null;
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                var params = {
                    desde: desde,
                    hasta: hasta,
                    producto: _this.tfProducto.getValue(),
                    numero: _this.tfFactura.getValue(),
                };
                Ext.Ajax.request({
                    url: '/logistica/facturacion/facturacion/recuperaciones/index.php/reportefideicomiso/exportExcel',
                    method: 'POST',
                    params: params,
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(resp.dirFichero, 'ventana', wCfg);
                    }
                });
            }
        });
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.tooltipLimpiar, handler: function () {
                _this.customTriggerClear();
            }
        });
        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function () {
                        if (render.isVisible())
                            _this.botonBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);


        this.gpPrincipal.getTopToolbar().add('-',
            new Ext.form.Label({text: 'Factura'}), ' :', _this.tfFactura, '-',
            new Ext.form.Label({text: 'Producto'}), ' :', _this.tfProducto, '-',
            new Ext.form.Label({text: 'Desde'}), ' :', _this.textDesde, '-'
            , new Ext.form.Label({text: 'Hasta'}), ' :', _this.textHasta, '-'
            , _this.btnBuscar, _this.btnExcel, _this.btnLimpiar);

        return render;

    },
    customTriggerClear: function () {
        var _this = this;
        _this.textDesde.setValue(null);
        _this.textHasta.setValue(null);
        _this.tfProducto.setValue(null);
        _this.tfFactura.setValue(null);
        _this.storePrincipal.on('beforeload', function (store) {
            store.baseParams = {
                start: 0,
                limit: null
            };
        });
        _this.getStorePrincipal().load();
    },
    botonBuscar: function () {
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        var desde = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d/m/Y') : null;
        var hasta = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d/m/Y') : null;

        _this.storePrincipal.on('beforeload', function (store) {
            store.baseParams = {
                desde: desde,
                hasta: hasta,
                producto: _this.tfProducto.getValue(),
                numero: _this.tfFactura.getValue(),
                start: 0,
                limit: null
            };
        });
        _this.getStorePrincipal().load();
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: 'No. Factura',
            width: 90,
            dataIndex: 'nfactura',
            default: true
        });
        this.addGridColumn({
            header: 'Fecha',
            width: 90,
            dataIndex: 'fecha',
            default: true
        });
        this.addGridColumn({
            header: 'Proveedor',
            width: 120,
            dataIndex: 'client',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'No. Comprobante',
            width: 70,
            dataIndex: 'cd',
            default: true
        });
        this.addGridColumn({
            header: 'Producto',
            width: 130,
            dataIndex: 'producto',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 80,
            dataIndex: 'cantidad',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'Existencia',
            width: 80,
            dataIndex: 'existencia',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'Importe',
            width: 80,
            dataIndex: 'importe',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'Liquidado',
            width: 80,
            dataIndex: 'liquidado',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: 'Pendiente',
            width: 80,
            dataIndex: 'pendiente',
            autoExpand: true,
            default: true
        });

    }
})
;