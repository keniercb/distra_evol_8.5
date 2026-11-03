Ext.ns('LOG.produccion.ordenproduccion');
 
LOG.produccion.ordenproduccion.winEstadoEjecucion = Ext.extend(LOG.util.UITemplate, {
    record: undefined,
    constructor: function (config) {
        this.listaCheckBoxs = new LOG.util.List();
        config.idioma = LOG.util.UIManager.apply(LOG.produccion.ordenproduccion.Idioma, LOG.util.Idioma);
        this.busquedaBasica = true;
        this.dirController = '/logistica/produccion/produccion/index.php/ordenproduccion';
        this.urlBusquedaGridPrincipal = 'cargarDocumentosGenerados';
        this.textBusquedaSimple = config.idioma.lbTextoBusquedaEstadoEjecucion;
        this.autoLoad = false;
        this.concepto = config.idioma.lbCampoBusquedaEstadoEjecucion;
        this.modoSeleccion = 1;
        this.autoSelect = false;
        this.formaVisualizacion = 'ventana';
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        this.record = config.record;
        LOG.produccion.ordenproduccion.winEstadoEjecucion.superclass.constructor.call(this, config);
        this.setTitulo();
        if (!config.pedido) {
            this.modelo = new LOG.produccion.ordenproduccion.Model({
                idioma: config.idioma
            });
        }
    },
    init: function () {
        var _this = this;
        LOG.produccion.ordenproduccion.winEstadoEjecucion.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

            _this.PanelEste = new LOG.produccion.ordenproduccion.PanelProductos({
                idioma: this.idioma,
                model: this.modelo,
                panelAgrupado: this,
                _parent: _this._parent
            });
            _this.PanelEste.init();
            var vistaEste = _this.PanelEste.view();
            _this.PanelRegionEste = LOG.util.UIManager.initPanel({
                layout: 'fit',
                region: 'east',
                width: '50%',
                frame: true,
                collapsible: true,
                collapsed: true,
                split: true,
                items: [vistaEste],
                listeners: {
                    'collapse': function () {
                        this.hide();
                        _this.getPanelGrid().doLayout();
                    },
                    'beforeexpand': function () {
                        this.show();
                        _this.getPanelGrid().doLayout();
                    }
                }
            });
            _this.getPanelGrid().add(_this.PanelRegionEste);

            _this.chxValeProduccion = new Ext.form.Checkbox({
                boxLabel: 'Vale de producci\xf3n',
                hideLabel: true,
                id: 'idvaleporoducion',
                name: 'valeproduccion',
                style: 'margin:8px 0px 0px 15px',
                checked: true,
                enableKeyEvents: true,
                listeners: {
                    'check': function (check, ckecked) {
                        if (ckecked) {
                            _this.chxValeEntrega.setValue(0);
                            _this.chxValeDevolucion.setValue(0);
                            _this.chxInfRecepcion.setValue(0);
                            _this.cmGridPrincipal.setHidden(_this.listaColumnas.getPosByField('dataIndex', 'deposito', 'header'), true);
                            _this.getStorePrincipal().load();
                            _this.PanelRegionEste.collapse();
                        }
                    }
                }
            });

            _this.chxValeEntrega = new Ext.form.Checkbox({
                boxLabel: 'Vale de entrega',
                hideLabel: true,
                id: 'idvaleentrega',
                name: 'valeentrega',
                style: 'margin:8px 0px 0px 15px',
                enableKeyEvents: true,
                listeners: {
                    'check': function (check, ckecked) {
                        if (ckecked) {
                            _this.chxValeProduccion.setValue(0);
                            _this.chxValeDevolucion.setValue(0);
                            _this.chxInfRecepcion.setValue(0);
                            _this.cmGridPrincipal.setHidden(_this.listaColumnas.getPosByField('dataIndex', 'deposito', 'header'), true);
                            _this.getStorePrincipal().load();
                            _this.PanelRegionEste.collapse();
                        }
                    }
                }
            });

            _this.chxValeDevolucion = new Ext.form.Checkbox({
                boxLabel: 'Vale de devoluci\xf3n',
                hideLabel: true,
                id: 'idvaledevolucion',
                name: 'valedevolucion',
                style: 'margin:8px 0px 0px 15px',
                enableKeyEvents: true,
                listeners: {
                    'check': function (check, ckecked) {
                        if (ckecked) {
                            _this.chxValeProduccion.setValue(0);
                            _this.chxValeEntrega.setValue(0);
                            _this.chxInfRecepcion.setValue(0);
                            _this.cmGridPrincipal.setHidden(_this.listaColumnas.getPosByField('dataIndex', 'deposito', 'header'), false);
                            _this.getStorePrincipal().load();
                            _this.PanelRegionEste.collapse();
                        }
                    }
                }
            });

            _this.chxInfRecepcion = new Ext.form.Checkbox({
                boxLabel: 'Informes de recepci\xf3n',
                hideLabel: true,
                id: 'idinfrecepcion',
                name: 'infrecepcion',
                enableKeyEvents: true,
                style: 'margin:8px 0px 0px 15px',
                listeners: {
                    'check': function (check, ckecked) {
                        if (ckecked) {
                            _this.chxValeProduccion.setValue(0);
                            _this.chxValeEntrega.setValue(0);
                            _this.chxValeDevolucion.setValue(0);
                            _this.cmGridPrincipal.setHidden(_this.listaColumnas.getPosByField('dataIndex', 'deposito', 'header'), true);
                            _this.getStorePrincipal().load();
                            _this.PanelRegionEste.collapse();
                        }
                    }
                }
            });

            _this.listaCheckBoxs.add(_this.chxValeProduccion);
            _this.listaCheckBoxs.add(_this.chxValeEntrega);
            _this.listaCheckBoxs.add(_this.chxValeDevolucion);
            _this.listaCheckBoxs.add(_this.chxInfRecepcion);

            _this.PanelOpcionesBusqueda = LOG.util.UIManager.initFocusPanel({
                region: 'north',
                border: true,
                height: 30,
                tbar: new LOG.util.Toolbar({
                    enableOverflow: true
                })
            });

            _this.PanelOpcionesBusqueda.getTopToolbar().height = 30;
            _this.PanelOpcionesBusqueda.getTopToolbar().add('-');
            _this.PanelOpcionesBusqueda.getTopToolbar().add(_this.listaCheckBoxs.getArray());
            _this.getPanelGrid().add(_this.PanelOpcionesBusqueda);

            _this.PanelEste.getStorePrincipal().on({
                'beforeload': function () {
                    if (_this.record.data.iddocumento && _this.chxValeProduccion.getValue() == 1) {
                        this.initBaseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                        this.initBaseParams.valeproduccion = 1;
                    } else if ((_this.chxValeEntrega.getValue() == 1 || _this.chxValeDevolucion.getValue() == 1 || _this.chxInfRecepcion.getValue() == 1) && _this.getSmPrincipal().getSelected()) {
                        this.initBaseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                        this.initBaseParams.valeproduccion = 0;
                    } else {
                        this.initBaseParams.iddocumento = -1;
                    }
                }
            });

            _this.getStorePrincipal().on({
                'beforeload': function () {
                    if (_this.chxValeProduccion.getValue() == 1) {
                        this.initBaseParams.valeproduccion = 1;
                        this.initBaseParams.valeentrega = 0;
                        this.initBaseParams.valedevolucion = 0;
                        this.initBaseParams.recepcion = 0;
                    } else {
                        this.initBaseParams.valeproduccion = 0;
                    }

                    if (_this.chxValeEntrega.getValue() == 1) {
                        this.initBaseParams.valeentrega = 1;
                        this.initBaseParams.valeproduccion = 0;
                        this.initBaseParams.valedevolucion = 0;
                        this.initBaseParams.recepcion = 0;
                    } else {
                        this.initBaseParams.valeentrega = 0;
                    }

                    if (_this.chxValeDevolucion.getValue() == 1) {
                        this.initBaseParams.valedevolucion = 1;
                        this.initBaseParams.valeentrega = 0;
                        this.initBaseParams.valeproduccion = 0;
                        this.initBaseParams.recepcion = 0;
                    } else {
                        this.initBaseParams.valedevolucion = 0;
                    }

                    if (_this.chxInfRecepcion.getValue() == 1) {
                        this.initBaseParams.recepcion = 1;
                        this.initBaseParams.valeentrega = 0;
                        this.initBaseParams.valeproduccion = 0;
                        this.initBaseParams.valedevolucion = 0;
                    } else {
                        this.initBaseParams.recepcion = 0;
                    }
                }
            });

            _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'selectionchange' && this.getCount() == 1) {
                    _this.PanelRegionEste.expand();
                    _this.PanelEste.getStorePrincipal().load();
                } else {
                    _this.PanelEste.getStorePrincipal().removeAll();
                    _this.PanelEste.getGridPrincipal().getView().refresh();
                }
            });
        });

        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
    },
    render: function () {
        var _this = this;
        var render = LOG.produccion.ordenproduccion.winEstadoEjecucion.superclass.render.call(this);
        
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            iddocumento: (_this.datos.iddocumento) ? _this.datos.iddocumento : -1
        });

        this.getStorePrincipal().load();
        return render;
    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            itemId: 'btnImprimir',
            tooltip: this.idioma.lbBtnImprimirModelo,
            disabled: true,
            handler: function () {
                console.info(_this)
                this.tipoReportes = new LOG.util.Report({
                    reports: [{
                        dirReport: '/distra/logistica/produccion/ordenproduccion/EstadoEjecucionModelo',
                        isList:true,
                        params: {
                            iddocumento:_this._parent.getGridPrincipal().getSelectionModel().getSelected().data.iddocumento,
                            idcartatecindustrial:_this._parent.getGridPrincipal().getSelectionModel().getSelected().data.idcartatecnologica,
                            nrodoc: _this.gridFilter.tfBusqueda.getValue() ? _this.gridFilter.tfBusqueda.getValue() : null,
                            valeentrega: (_this.chxValeEntrega.getValue() == 1) ? true : false,
                            recepcion: (_this.chxInfRecepcion.getValue() == 1) ? true : false,
                            valedevolucion: (_this.chxValeDevolucion.getValue() == 1) ? true : false
                        }
                    }]
                });
                this.tipoReportes.view();
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RB') || _this._parent.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            b.setDisabled(!(this.getCount() > 0));
                        }
                    }, 'imprimirEE');
                } else {
                    b.setVisible(false);
                }
            }
        }));
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgTipoDocumento,
            width: 180,
            dataIndex: 'tipodocumento',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgNumeroDocumento,
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgNumeroReferencia,
            width: 100,
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgEstado,
            width: 100,
            dataIndex: 'estado',
            default: true,
            renderer: function (v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgFechaEmision,
            width: 100,
            dataIndex: 'fechacontable',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgValeEntrega,
            width: 100,
            dataIndex: 'nrovaleent',
            hidden: true,
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgDeposito,
            dataIndex: 'deposito',
            default: true,
            autoExpand: true,
        });

        this.addGridColumn({dataIndex: 'iddeposito'});

        this.addGridColumn({dataIndex: 'iddocumento'});

        this.addGridColumn({dataIndex: 'iddoc'});
    },
    setTitulo: function () {
        var _this = this;
        this.getVistaPrincipal().setTitle(String.format(this.idioma.tlVentanaEstadoEjecucion, this.record.data.nrodoc, this.record.data.fechacontable, LOG.lb.documento.Estado[this.record.data.estado]));
    }
});

LOG.produccion.ordenproduccion.PanelProductos = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.autoLoad = false;
        this.concepto = 'productos';
        this.busquedaBasica = true;
        this.idGridPrincipal = 'idproductos';
        this.dirController = '/logistica/produccion/produccion/index.php/ordenproduccion';
        this.urlBusquedaGridPrincipal = 'cargarProductosEjecucion';
        this.textBusquedaSimple = 'C\xf3digo, Denominaci\xf3n';
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'panel';
        LOG.produccion.ordenproduccion.PanelProductos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'C\xf3digo',
            width: 160,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: 'C\xf3digo del proveedor',
            width: 160,
            dataIndex: 'codigoproveedor',
            default: true
        });

        this.addGridColumn({
            header: 'Denominaci\xf3n',
            width: 220,
            dataIndex: 'text',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({
            header: 'UM',
            width: 60,
            dataIndex: 'umedida',
            default: true
        });

        this.addGridColumn({
            header: 'Cantidad',
            width: 120,
            dataIndex: 'cantidad',
            align: 'right',
            default: true
        });

        this.addGridColumn({dataIndex: 'idproducto'});

        this.addGridColumn({dataIndex: 'idindicador'});

        this.addGridColumn({dataIndex: 'idestructura'});
    },
    render: function () {
        var render =  LOG.produccion.ordenproduccion.PanelProductos.superclass.render.call(this);
        return render;
    }
});