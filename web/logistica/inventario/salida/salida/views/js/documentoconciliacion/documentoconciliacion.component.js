Ext.ns('LOG.inv.documentoconciliacion');
LOG.inv.documentoconciliacion.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function(config) {
        LOG.util.UIManager.apply(config.idioma, LOG.inv.documentoconciliacion.Idioma);
        LOG.inv.documentoconciliacion.VentanaAdicionar.superclass.constructor.call(this, config);

    },
    initDefaultButtons: function() {
        var _this = this; 
       
        LOG.inv.documentoconciliacion.VentanaAdicionar.superclass.initDefaultButtons.call(this);
        this.listaBotonesVentana.deleteAll();
        
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonEliminar({
            tooltip:this.idioma.ttBtnEliminarV,
            handler: function() {
                _this.modelo.eliminar({}, function() {
                    _this.close();
                });

            },
            controlFn: function(b, _caller) {
                b.disable();
                if (_this.record && _this.record.data.estado == '1') {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            handler: function() {
                _this.modelo.confirmar(_this.record.data, function(r) {
                    Ext.apply(_this.record.data, {estado: '2'});
                    _this.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                });
            },
            controlFn: function(b, _caller) {
                b.disable();
                if (_this.record && _this.record.data.estado == '1') {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            text: this.idioma.lbBtnAnularEstado,
            tooltip: this.idioma.ttBtnAnularEstado,
            handler: function() {
                _this.modelo.anularestado(_this.record.data, function(r) {
                    Ext.apply(_this.record.data, {estado: '1'});
                    _this.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                });
            },
            controlFn: function(b, _caller) {
                b.disable();
                if (_this.record && _this.record.data.estado == '2') {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.aprobar(_this.record.data, function(r) {
                    Ext.apply(_this.record.data, {estado: '3'});
                    _this.listaBotonesVentana.each(function(b) {
                        LOG.util.UIManager.applyKey(b, _this);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this, [b, _this]).call();
                        }
                    }, _this);
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                });
            },
            controlFn: function(b, _caller) {
                b.disable();
                if (_this.record && _this.record.data.estado == '2') {
                    b.enable();
                } else {
                    b.disable();
                }
            }
        }));
        this.listaBotonesProductos.deleteAll();
    },
    builComponent: function() {
     LOG.inv.documentoconciliacion.VentanaAdicionar.superclass.builComponent.call(this);
     this.btnNuevo.hidden = true;
   
    },
    initDefaultColumns: function() {
        var _this = this;
        LOG.inv.documentoconciliacion.VentanaAdicionar.superclass.initDefaultColumns.call(this);
        this.listaGridColumnsProductos.deleteAll();
        this.addGridColumnProductos({    
            header: this.idioma.gcNumeroTransferencia,
            width: 100,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumnProductos({
            header: this.idioma.cgFechaCreado,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumnProductos(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cgImporte,
            width: 80,
            align: 'right',
            dataIndex: 'importe',
            default: true
        }));
    },
    prepareDocModify: function(d) {

        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            this.record = d;
            this.stGridDetalles.on({
                beforeload: function() {
                    this.initBaseParams.iddocumento = d.data.iddocumento;
                }
            });
            this.stGridDetalles.load();
            this.modelo.loadRecord(d);
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    salvarHandler: function() {

        var _this = this.scope || this;
        var datrecord = _this.stGridDetalles.getModifiedRecords();
        if (datrecord) {
            var datos = new Array();
            Ext.each(datrecord, function(rec) {
                datos.push(rec.data);
            });
        }
        _this.modelo.salvar({
            idestructuracomun: _this.scope.idDeposito,
            transferencia: Ext.encode(datos)
        }, function(r) {
                _this.stGridDetalles.load();
        });

    }
});

LOG.inv.documentoconciliacion.Nuevo = Ext.extend(LOG.util.UITemplate, {
    iddeposito: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.usarAplicar = false;
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.autoLoad = false;
        this.autoShow = false;
        this.idioma = {};
        this.urlBusquedaGridPrincipal = 'cargarClientesConTransferecia';
        LOG.util.UIManager.apply(this.idioma, LOG.inv.documentoconciliacion.Idioma);
        LOG.inv.documentoconciliacion.Nuevo.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.tlAdicionar;
        this.getVistaPrincipal().width = 500;
        this.getVistaPrincipal().height = 500;
        this.getVistaPrincipal().resizable = false;

        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    setModel: function(modelonuevo) {
        this.modelo = modelonuevo;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            dataIndex: 'idcliente',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.gcCliente,
            width: 120,
            dataIndex: 'cliente',
            default: true,
            autoExpand: true,
        });
        this.addGridColumn({
            header: this.idioma.gcCantidadTransferencia,
            width: 120,
            dataIndex: 'cantidad',
            default: true
        });
    },
    handlerAdicionar: function(_fn) {
        var _this = this;
        var datos = new Array();
        Ext.each(_this.smGridPrincipal.getSelections(), function(rec) {
            datos.push(rec.json);
        });
        this.modelo.crearDocumentoConciliacion(datos, this.iddeposito, _fn);
    },
    render: function() {
        var _this = this;

        var vista = LOG.inv.documentoconciliacion.Nuevo.superclass.render.call(this);

        this.smGridPrincipal.on('rowselect', function() {
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }, this);
        this.smGridPrincipal.on('rowdeselect', function() {
            if (this.smGridPrincipal.getCount() == 0) {
                this.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        }, this);
        this.getStorePrincipal().on({
            beforeload: function() {
                this.initBaseParams.idestructuracomun = _this.iddeposito;
            }
        });
        vista.on({
            'show': function() {
                _this.getStorePrincipal().load();
            }
        });
        return vista;
    }
});

LOG.inv.documentoconciliacion.Conciliacion = Ext.extend(LOG.inv.documentoconciliacion.VentanaAdicionar, {
    constructor: function(config) {

        LOG.util.UIManager.apply(config.idioma, LOG.inv.documentoconciliacion.Idioma);
        LOG.inv.documentoconciliacion.Conciliacion.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {
        LOG.inv.documentoconciliacion.Conciliacion.superclass.initDefaultColumns.call(this);
        this.addGridColumnProductos({
            dataIndex: 'idconciliaciontransferencia',
            hidden: true
        });
        this.addGridColumnProductos({
            header: this.idioma.gcRecibido,
            width: 90,
            dataIndex: 'recibido',
            editor: new Ext.form.Checkbox({checked: false}),
            default: true,
            renderer: function(value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-activo';

                } else {
                    metaData.css = 'log-inactivo';

                }
            }

        });
        this.addGridColumnProductos({
            header: this.idioma.gcMotivo,
            width: 150,
            dataIndex: 'motivo',
            default: true,
            autoExpand: true,
            editor: new Ext.form.TextField({
                allowBlank: true
            })
        });
    },
    builComponent: function() {
        LOG.inv.documentoconciliacion.Conciliacion.superclass.builComponent.call(this);
        this.gridDetalles.on('beforeedit', function(e) {
            if (this.record != null) {
                e.cancel = false;
            }
        }, this);
        this.btnSalvar.enable();

    },
    initDefaultButtons: function() {
        LOG.inv.documentoconciliacion.Conciliacion.superclass.initDefaultButtons.call(this);
        this.listaBotonesVentana.deleteAll();
        //this.getVistaPrincipal().listaBotones.getItem(1).disable();
        
    },
    salvarHandler: function() {

        var _this = this.scope || this;
        var datrecord = null;
        datrecord = _this.stGridDetalles.getModifiedRecords();
        var datos = new Array();
        Ext.each(datrecord, function(rec) {
            datos.push(rec.data);
        });

        _this.modelo.salvar({
            idestructuracomun: _this.scope.idDeposito,
            transferencia: Ext.encode(datos)
        }, function(){
            _this.stGridDetalles.load();
        });

    }
});