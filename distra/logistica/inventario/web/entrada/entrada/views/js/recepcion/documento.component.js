Ext.ns('LOG.inv.entrada.documento');
LOG.inv.entrada.documento.View = Ext.extend(LOG.util.UITemplate, {
    dirReport: undefined,
    constructor: function(config) {
        this.autoLoad = false;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 1;
        this.busquedaBasica = true;
        this.dirController = '/logistica/inventario/entrada/entrada/index.php/recepcion';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosExternos';
        var valores = [OPRE_REC_TRANS, OPRE_REC_TRANS_INT, OPRE_REC_TRANS_CG_CE, OPRE_REC_TRANS_CE_CG, OPRE_REC_OP, OPRE_REC_FAC, OPRE_REC_FAC711];
        var contador = 0;
        var existe = 0;
        Ext.each(valores, function(variable) {
            var valor = String(variable).split(',');
            Ext.each(valor, function(v) {
                if (parseInt(config.idnomoperaciones) == v) {
                    existe = contador;
                }
            });
            contador++;
        });
        switch (existe) {
            case 0 :
                this.proceso = 'transferencia';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
            case 1:
            case 2:
            case 3:
                this.proceso = 'transferenciaint';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
            case 4:
                this.proceso = 'produccion';
                this.concepto = config.idioma.ttBtnBuscarProduccion;
                this.name = 'OrdenProduccion';
                this.dirReport = '/logistica/produccion/produccion/';
                break;
            case 5:
                this.proceso = 'facturacion';
                this.concepto = config.idioma.ttBtnBuscarFactura;
                this.name = 'Facturacion';
                this.dirReport = '/logistica/facturacion/facturacion/';
                break;
            case 6:
                this.proceso = 'factura711';
                this.concepto = config.idioma.ttBtnBuscarFactura;
                this.name = 'Factura711';
                //this.dirReport = '/logistica/facturacion/facturacion/';
                break;
            default:
                this.proceso = 'transferencia';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
        }
        /*switch (parseInt(config.idnomoperaciones)) {
            case parseInt(OPRE_REC_TRANS) :
                this.proceso = 'transferencia';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
            case parseInt(OPRE_REC_TRANS_INT):
                this.proceso = 'transferenciaint';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
			case parseInt(OPRE_REC_TRANS_CG_CE):
                this.proceso = 'transferenciaint';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
            case parseInt(OPRE_REC_TRANS_CE_CG):
                this.proceso = 'transferenciaint';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
            case parseInt(OPRE_REC_OP):
                this.proceso = 'produccion';
                this.concepto = config.idioma.ttBtnBuscarProduccion;
                this.name = 'OrdenProduccion';
                this.dirReport = '/logistica/produccion/produccion/';
                break;
            case parseInt(OPRE_REC_FAC):
                this.proceso = 'facturacion';
                this.concepto = config.idioma.ttBtnBuscarFactura;
                this.name = 'Facturacion';
                this.dirReport = '/logistica/facturacion/facturacion/';
                break;
            case parseInt(OPRE_REC_FAC711):
                this.proceso = 'factura711';
                this.concepto = config.idioma.ttBtnBuscarFactura;
                this.name = 'Factura711';
                //this.dirReport = '/logistica/facturacion/facturacion/';
                break;
            default:
                this.proceso = 'transferencia';
                this.concepto = config.idioma.ttBtnBuscarTransferencia;
                this.name = 'Transferencia';
                this.dirReport = '/logistica/inventario/salida/transferencia/';
                break;
        }*/
        this.dirReport = (window.reportSpace ? window.reportSpace : '/distra') + (this.dirReport);
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        LOG.inv.entrada.documento.View.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.title;
        this.getVistaPrincipal().width = 500;
        this.getVistaPrincipal().height = 350;
        this.getVistaPrincipal().resizable = false;
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttBtnImprimir,
            menu: [
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirListado,
                    isList: true,
                    disabled: true,
                    name: 'Listado',
                    handler: _this.reporteFn.createDelegate()
                }),
                new Ext.menu.Item({
                    text: this.idioma.lbBtnImprimirModelo,
                    isList: false,
                    name: alternativa == true ? 'DualModelo' : 'Modelo',
                    handler: _this.onReport.createDelegate()
                })
            ],
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RB') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_this.getSmPrincipal(), 'fireEvent', function(e) {
                        if (e == 'selectionchange') {
                            b.menu.get(1).setDisabled(this.getCount() > 1);
                        }
                    }, 'imprimir');
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function(e) {
                        if (e == 'load') {
                            b.setVisible(this.getCount() > 0);
                        }
                    }, 'imprimir');
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'iddocumento'});
        this.addGridColumn({dataIndex: 'idsolicitud711'});
        this.addGridColumn({dataIndex: 'idcliente'});
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({
            header: this.idioma.cgNroDoc,
            width: 100,
            dataIndex: (_this.proceso == 'factura711') ? 'nosolicitud' :'nrodoc',
            default: true,
            filter : {
                type : 'string',
                emptyText : _this.idioma.cgNroDoc,
                dataIndex : 'nrodoc'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbDfFecha,
            width: 80,
            dataIndex: (_this.proceso == 'factura711') ? 'fechacreacion' :'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.lbCbSuministrador,
            width: 180,
            autoExpand: (_this.proceso == 'factura711') ? false : true,
            dataIndex: 'denominacion',
            hidden: (_this.proceso == 'factura711') ? true : false,
            default: true
        });
        this.addGridColumn({
            header: 'Descripci\xf3n',
            width: 220,
            autoExpand: (_this.proceso == 'factura711') ? true : false,
            dataIndex: (_this.proceso == 'factura711') ? 'descripciongeneral' : 'observaciones',
            default: true,
            filter : {
                type : 'string',
                emptyText : 'Descripci\xf3n',
                dataIndex : (_this.proceso == 'factura711') ? 'descripciongeneral' : 'observaciones'
            }
        });
        this.addGridColumn({
            header: 'A\xf1o',
            width: 80,
            dataIndex: 'ejercicio',
            default: true,
            hidden: (_this.proceso == 'factura711') ? false : true,
            filter : {
                type : 'string',
                emptyText : 'A\xf1o',
                dataIndex : 'ejercicio'
            }
        });
    },
    render: function() {
        var _this = this;
        var render = LOG.inv.entrada.documento.View.superclass.render.call(this);
        Ext.apply(this.getStorePrincipal(), {
            initBaseParams: {
                proceso: _this.proceso,
                conduce: (_this.idnomoperaciones == 990000000249) ? 1 : null,
                idestructura: _this.idestructura
            }
        });
        this.getStorePrincipal().load();
        LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange') {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                if (this.getCount() == 1) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }
            }
        }, 'render');
        return render;
    },
    getParamsReport: function(record, btn) {
        return;
    },
    buildReport: function(btn, record) {
        return {
            name: btn.name,
            description: btn.name + " # " + (record.get('numeroref') || record.get('nrodoc')) + " del " + record.get('fechacontable') + " en " + LOG.lb.documento.Estado[record.get('estado')],
            isList: false,
            params: {
                useSign: false,
                hasCategoria: (window.usarCategoria) ? 'true' : 'false'
            },
            dirReport: this.dirReport + btn.name,
            uiSearch: {}
        };
    },
    onReport: function(btn) {
        var _this = this;
        var record = this.getGridPrincipal().getSelectionModel().getSelected();
        new LOG.util.Report({
            reports: [this.buildReport(btn, record)]
        }).view();
    }
});