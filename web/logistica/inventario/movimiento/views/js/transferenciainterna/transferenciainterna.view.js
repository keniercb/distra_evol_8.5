Ext.apply(Ext.form.VTypes, {
    validarRangoFecha : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return false;
        }
        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                end.setMinValue(date);
                end.validate();
            }
        }
        return true;
    }
});


Ext.ns('LOG.inv.transferenciainterna');

/**
 * Plantilla tipo ViewPort para gestion de transferencia entre areas.
 * @type LOG.util.UITemplate
 */
LOG.inv.transferenciainterna.View = Ext.extend(LOG.lb.documento.View, {
    name: 'TransferenciaInterna',
    cantSign: 3,
    winMod: false,
    signDetails: {
        1: 'Elaborado',
        2: 'Aprobado',
        3: 'Contabilizado'
    },
    dirReport: '/logistica/inventario/movimiento/transferenciainterna/',
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        config.modoSeleccion = 1;
        LOG.util.UIManager.apply(config.idioma, LOG.lb.documento.Idioma);
        config.model = new LOG.inv.transferenciainterna.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.concepto;
        LOG.inv.transferenciainterna.View.superclass.constructor.call(this, config);
        this.winGestionarDocumento = new LOG.inv.transferenciainterna.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            maximized: true,
            title: "Transferancia interna",
            width: 750,
            acciones:this.acciones
        });
    },
    /**
     * Inicializa los componentes.
     * @returns {undefined}
     */
    init: function () {
        var _this = this;
        LOG.inv.transferenciainterna.View.superclass.init.call(this);
       // this.initPanelSuperior();
        //this.initPanelInferior();
        Ext.apply(this.winGestionarDocumento, {
            salvarHandler: function () {
                var _self = _this.winGestionarDocumento;
                _self.modelo.salvar({/*idestructuracomun: _this.idDeposito*/}, function (r) {
                    if (_self.modelo.listaProductos.count()) {
                        _self.cargarProductos();
                    }
                    _self.tipoVentana = 2;
                    if (_self.record == null) {
                        _self.record = {};
                        Ext.apply(_self.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1",
                                cantproductos: r.cantproductos
                            }
                        });
                    }
                    _this.habilitarElementos();
                    _self.getTitleDocumento(r.iddocumento);
                    _self.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _self);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_self, [b, _self]).call();
                        }
                    }, _self);
                });
            },
            beforeEditProducto: function (o) {
                o.cancel = true;
            },
            beforeLoadProductos: function () {
                _this.winGestionarDocumento.stGridDetalles.baseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.winGestionarDocumento.stGridDetalles.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
                _this.winGestionarDocumento.stGridDetalles.baseParams.idarea = (_this.modelo.idareaorigen) ? _this.modelo.idareaorigen : -1;
                _this.winGestionarDocumento.stGridDetalles.initBaseParams.idarea = (_this.modelo.idareaorigen) ? _this.modelo.idareaorigen : -1;
                
            },
            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!_this.winGestionarDocumento.record
                    || (nuevo && _this.winGestionarDocumento.record.data.estado != '3')
                    || (!nuevo && _this.winGestionarDocumento.record.data.estado == '1')
                    )
                ) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        });
    },
    initVentanaGestion: function (d, tipoVentana, noCargar) {
        this.winMod = false;
        if (!this.winGestionarDocumento.isInit()) {
            this.winGestionarDocumento.init();
            if (this.winGestionarDocumento.formularioGeneral != null) {
                this.winGestionarDocumento.addPanelSuperior(this.winGestionarDocumento.formularioGeneral);
            }
            if (this.formularioSur != null) {
                this.winGestionarDocumento.addPanel(this.formularioSur);
            }
            if (this.formularioEste != null) {
                this.winGestionarDocumento.addPanel(this.formularioEste);
            }
            if (this.formularioOeste != null) {
                this.winGestionarDocumento.addPanel(this.formularioOeste);
            }
        }
        this.winGestionarDocumento.tipoVentana = tipoVentana || 1;

        if (d) {
            this.winMod = true;
            this.winGestionarDocumento.prepareDocModify(d, noCargar);
        } else {
            this.winGestionarDocumento.fromularioGestion.getForm().loadRecord({data: {}});
            //this.winGestionarDocumento.gridProductosG.idtarjetamedicamento = undefined;
        }
        this.winGestionarDocumento.show();
        this.winGestionarDocumento.maximize();
    },
    /**
     * Inicializa los botones de la ventana.
     * @returns {undefined}
     */
    initDefaultButtons: function () {
        var _this = this;
        LOG.inv.transferenciainterna.View.superclass.initDefaultButtons.call(this);
        // Bloque de botones de la interfaz principal.
        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(0).handler.createSequence(function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });
        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function () {
            _this.habilitarElementos();
        });
        this.winGestionarDocumento.onResetHandler = this.winGestionarDocumento.onResetHandler.createSequence(function (e) {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.habilitarElementos();
        });

        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                Ext.MessageBox.wait('Validando datos', _this.idioma.msgEspere || '...');
                Ext.Ajax.request({
                    url: 'getValidarConfirmar',
                    method: 'POST',
                    params: {
                        iddocumento: _this.smGridPrincipal.selections.items[0].data.iddocumento
                    },
                    callback: function(o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.success) {
                            if (resp.msg == 1) {
                                mostrarMensaje(3, 'El documento que desea confirmar no contiene productos.');//para cuando no hay productos
                            }
                            if (resp.msg == 2) {
                                mostrarMensaje(3, 'Existen productos sin cantidades registradas.');// para cuando no tienen lotes los productos
                            }
                            if (resp.msg == 0) {
                                _this.modelo.confirmar();
                            }
                        }
                    }

                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'confirmar1');
                } else {
                    b.hide();
                }
            }
        }), 3);

        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnular,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == '2') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularestado1');
                } else {
                    b.hide();
                }
            }
        }), 4);

        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.aprobar({iddocumento:_this.smGridPrincipal.selections.items[0].data.iddocumento},function(){
                    _this.getTitleDocumento(_this.smGridPrincipal.selections.items[0].data.iddocumento);
                    _this.record.data.estado = 3;
                    _this.controlBtns();
                });
               // _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                _this.habilitarElementos();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            b.setDisabled(!(
                            ( this.getCount() == 1 && this.getSelected().data.estado == '2' ) && //first
                            ( ( window.useSign && typeof pki == 'object' ) ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    }, 'aprobar1');
                } else {
                    b.hide();
                }
            }
        }), 5);

       /* this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT1') || _caller.grantedAction('RCRUD1')) {
                    b.show();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'duplicar1');
                } else {
                    b.hide();
                }
            }
        }), 6);*/


        this.listaBotones.getItem(9).id = 'idtransferencia';

        // Fin del bloque de botones.


        // Bloque de botones del panel superior de la interfaz de adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminar,
            disabled: true,
            handler: function () {
                _this.modelo.eliminar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

     /*   LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "2"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "2";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.onShow();
                    _this.winGestionarDocumento.cargarProductos(_this.modelo);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "1";
                    }
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(3), {
            tooltip: this.idioma.ttBtnAprobar,
            handler: function () {
                _this.modelo.aprobar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "3"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "3";
                    }
                    _this.winGestionarDocumento.tipoVentana = 3;
                    _this.winGestionarDocumento.listaBotonesVentana.each(
                        function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.habilitarElementos();
                });
            },
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(4), {
            tooltip: this.idioma.ttBtnDuplicar,
            handler: function () {
                _this.modelo.duplicar({iddocumento: _this.winGestionarDocumento.record.data.iddocumento}, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    if (_this.winGestionarDocumento.record == null) {
                        _this.winGestionarDocumento.record = {};
                        Ext.apply(_this.winGestionarDocumento.record, {
                            data: {
                                iddocumento: r.iddocumento,
                                estado: "1"
                            }
                        });
                    } else {
                        _this.winGestionarDocumento.record.data.estado = "1";
                    }
                    _this.winGestionarDocumento.tipoVentana = 2;
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            disabled: true,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (_this.winGestionarDocumento.record) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });*/

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(5), {
            controlFn: function (b, _caller) {
                b.hide();
            }
        });

        // Fin del bloque de botones.


        // Bloque de botones de la interfaz aprobar.



        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            hidden: true,
            tooltip: this.idioma.ttBtnAnular,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado(null, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.show();
                        if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    } else {
                        b.hide();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));
        // Fin del bloque de botones.


        // Bloque de botones del panel de productos de la interfaz de adicionar.
        var btnProducto = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnProducto,
            tooltip: this.idioma.ttBtnProducto,
            iconCls: 'producto',
            disabled: true,
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1')) &&
                    _this.modelo.basicForm && _this.modelo.basicForm.isValid()) {
                    return false;
                }
                return true;
            },
            handler: function () {
                var _p = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        idarea: _this.modelo.idareaorigen || _this.winGestionarDocumento.cbAreaOrigen.getValue(),
                        iddocumento: _this.modelo.iddocumento || -1,
                        tipoproducto: "[1, 4]"
                    }
                });
                _p.postSalvar = _p.postSalvar.createSequence(function (r) {
                    _this.winGestionarDocumento.record.data.cantproductos = r.cantproductos;
                    _p.getStorePrincipal().initBaseParams.iddocumento = _this.modelo.iddocumento;
                    _p.reiniciarBusqueda();
                    _this.habilitarElementos();
                });
                _p.init();

                var vistaProductos = _p.view();
                _p.tipoProducto.disable();
                vistaProductos.show();
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnProducto, 0);
        this.modelo.addActionButton(btnProducto, true);

        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesProductos.getItem(1), {
            tooltip: this.idioma.ttBtnEliminarProd,
            disabled: true,
            handler: _this.handlerEliminarMov,
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        _caller.smGridDetalles.fireEvent = _caller.smGridDetalles.fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0 && (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '1')) {
                                    b.enable();
                                } else {
                                    b.disable();
                                    _this.formularioSur.collapse();
                                }
                            }
                        });
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        // Fin del bloque de botones.
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        LOG.inv.transferenciainterna.View.superclass.initDefaultColumns.call(this);
       
        var pos = this.listaColumnas.getPosByField('dataIndex', 'fechacontable', 'header');
       /* this.insertGridColumn({
            header: this.idioma.cgTipoTransferencia,
            width: 170,
            dataIndex: 'tipotransferencia',
            default: true
        }, pos + 1);*/
        this.insertGridColumn({
            header: this.idioma.cgAreaOrigen,
            width: 160,
            dataIndex: 'areaorigen',
            default: true
        }, pos + 2);

        this.insertGridColumn({
            header: this.idioma.cgAreaDestino,
            width: 160,
            dataIndex: 'areadestino',
            default: true
        }, pos + 3);

        /*this.insertGridColumn({
            header: this.idioma.lbCbTipoTransferenciaArea,
            width: 160,
            dataIndex: 'text',
            default: true
        }, pos + 4);*/
        //this.addGridColumn({dataIndex: 'idtipotransferencia'});
        this.addGridColumn({dataIndex: 'idtransfinterna'});
        this.addGridColumn({dataIndex: 'iddeposorigen'});
        this.addGridColumn({dataIndex: 'iddeposdestino'});
        this.addGridColumn({dataIndex: 'controlfirma'});
        this.addGridColumn({dataIndex: 'idnodo'});
        this.addGridColumn({dataIndex: 'iddoc'});
        this.addGridColumn({dataIndex: 'devolucion'});
        this.addGridColumn({dataIndex: 'idconcepretenido'});
        this.addGridColumn({dataIndex: 'idmotivodevolucion'});
        this.addGridColumn({dataIndex: 'idtipotransfinterna'});
        this.addGridColumn({dataIndex: 'areaorigen'});
        this.addGridColumn({dataIndex: 'areadestino'});
        this.addGridColumn({dataIndex: 'text'});
        this.addGridColumn({dataIndex: 'conceretenido'});
        this.addGridColumn({dataIndex: 'idoperacionorigen'});
        this.addGridColumn({dataIndex: 'idoperaciondestino'});

        pos = this.winGestionarDocumento.listaGridColumnsProductos.getPosByField('dataIndex', 'nacionalidad', 'header');
       /* this.insertGridColumnProductos(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgExistenciaArea,
            dataIndex: 'existencia_area',
            align: 'right',
            width: 120
        }), pos + 1);*/
    },
    /**
     * Programa los eventos y devuelve la vista principal.
     * @returns {vistaPrincipal}
     */
    render: function () {
        var _this = this;
    this.getPanelBusqueda().setColumns(1);

   /* this.attachPlugin(new LOG.lb.plugin.ComboDepositos({
    caso : 3
}));*/
    var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

//Elementos de la busqueda avanzada
    fpDatosBusqueda.addComponent(this.cmbEstado = new LOG.util.ComboBox({
        fieldLabel: this.idioma.lbEstado,
        hiddenName: 'estado',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]]//,
              //  [5, LOG.lb.documento.Estado[5]]
            ]
        }),
        valueField: 'idestado',
        displayField: 'estado',
        editable: true
    }));


    /*fpDatosBusqueda.addComponent(this.cmbTipoTranferencia = new Ext.erp.comboNomenclador({
        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        modelo: 'NomTipotransfinterna',
        idnom: 'idtipotransfinterna',
        name: 'idtipotransfinterna',
        hiddenName: 'idtipotransfinterna',
        autoCargar: true,
        disable: true,
        allowBlank: true,
        fieldLabel: this.idioma.lbCbTipoTransferenciaArea,
        listeners: {
            select: function (_cb, _r) {
                _this.cmbAreaOrigen.fireEvent('expand', _this.cmbAreaOrigen);
                _this.cmbAreaOrigen.setValue(null);
                _this.cmbAreaOrigen.enable();

                _this.cmbAreaOrigen.getStore().load({
                    params:{
                        idtipotransfinterna: _cb.getValue()
                    }
                });
            },
            'change': function(field){
                _this.cmbAreaOrigen.fireEvent('expand', _this.cmbAreaOrigen);
                _this.cmbAreaOrigen.setValue(null);
                _this.cmbAreaOrigen.enable();
                _this.cmbAreaOrigen.getStore().load({
                    params:{
                        idtipotransfinterna: field.getValue()
                    }
                });
            }
        }
    }));*/

    var stAreasOrigenDestino = new Ext.data.Store({
        url: '/logistica/inventario/movimiento/index.php/transferenciainterna/cargarAreasOrigenDestino',
        reader: new Ext.data.JsonReader({
                id: "idfila",

                root: "datos"
            },
            [
                {name: 'idfila'},
                {name: 'text'},
                {name: 'retenido'},
                {name: 'iddeposorigen'},
                {name: 'iddeposdestino'},
            ])
    });

    

   // fpDatosBusqueda.addComponent(cmbAreaOrigen);


    this.cmbAreaDestino = new LOG.util.ComboBox({
        fieldLabel: _this.idioma.lbAreaDestino,
        store: stAreasOrigenDestino,
        valueField: 'idfila',
        displayField: 'text',
        name: 'iddeposdestino',
        hiddenName: 'iddeposdestino',
        autoCargar: true,
        disable: true,
        editable: false,
        listeners:{
            'select': function(cmb, rec){
                if (_this.cmbAreaOrigen.getValue() == cmb.getValue()) {
                    mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                    cmb.reset();
                }
            }
        }
    });

    this.cmbAreaOrigen = new LOG.util.ComboBox({
        fieldLabel: this.idioma.lbAreaOrigen,
        store: stAreasOrigenDestino,
        valueField: 'idfila',
        displayField: 'descripcion',
        name: 'iddeposorigen',
        hiddenName: 'iddeposorigen',
        displayField: 'text',
        mode:'remote',
        disable: true,
        autoLoad: true,
        editable: false,
        listeners:{
            'change':function(field, newValue, oldValue){
                if (field.getValue()) {
                   _this.cmbAreaDestino.enable();
                }
                if (_this.cmbAreaDestino.getValue() == field.getValue()) {
                    mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                    field.reset();
                }

            },'select':function(cmb, rec){
                _this.cmbAreaDestino.enable();
                var bandera = false;
                if (_this.cmbAreaDestino.getValue() == cmb.getValue()) {
                    mostrarMensaje(3, _this.idioma.msgErrorSelecCombo);
                    cmb.reset();
                    bandera = true;
                }
            }

        }
    });
    fpDatosBusqueda.addComponent(this.cmbAreaOrigen);
    fpDatosBusqueda.addComponent(this.cmbAreaDestino);

    fpDatosBusqueda.addComponent(this.cmbUsuarioCreadoPor = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: _this.idioma.lbCreadoPor,
        hiddenName: 'creadopor',
        alias: 'transferenciaLog',
        subsistema: 10
    }));

    fpDatosBusqueda.addComponent(this.cmbUsuarioAprobadoPor = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: _this.idioma.lbAprobadoPor,
        hiddenName: 'aprobadopor',
        alias: 'transferenciaLog',
        subsistema: 10
    }));

    /*fpDatosBusqueda.addComponent(new Ext.erp.comboNomenclador({
        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        modelo: 'NomLineaProductoFarm',
        idnom: 'idlineaprod',
        name: 'denominacion',
        autoCargar: true,
        allowBlank: false,
        disabled: false,
        fieldLabel: _this.idioma.lbLineaprod
    }));*/

    var fpFechas = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpFechas.addComponent(this.dfFechaInicio = new Ext.form.DateField({
        fieldLabel: _this.idioma.lbDesde,
        name: 'desde',
        xtype: 'validarRangoFecha',
        vtype: 'daterange',
        format: 'd/m/Y',
        id: 'dfFechaInicio',
        endDateField: 'dfFechaFin',
        editable: false
    }));
    this.dfFechaFin = new Ext.form.DateField({
        fieldLabel: _this.idioma.lbHasta,
        name: 'hasta',
        xtype: 'validarRangoFecha',
        vtype: 'daterange',
        id: 'dfFechaFin',
        format: 'd/m/Y',
        startDateField: 'dfFechaInicio',
        editable: false
    });
    fpFechas.addComponent(this.dfFechaFin);

    _this.addFilterComponent(fpDatosBusqueda);
    _this.addFilterComponent(new Ext.form.FieldSet({
        title: _this.idioma.tlRangoFecha,
        items: [fpFechas]
    }));
        var render = LOG.inv.transferenciainterna.View.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().load();
        return render;
    },
    /**
     * Resetea los datos de entrada de transferencia de movimientos.
     * @param {String} nombre
     * @param {Bollean} seleccionado
     * @returns {undefined}
     */
    resetearDatos: function (nombre, seleccionado) {
        Ext.each(this[nombre].find('campo', true), function (item) {
            item.reset();
            item.setDisabled(!seleccionado);
        });
        Ext.each(this[nombre].getBottomToolbar().find('btn', true), function (b) {
            b.disable();
        });
    },
    /**
     * Habilita o deshabilita los botones.
     * @returns {undefined}
     */
    habilitarElementos: function () {
        if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            if (!this.record || this.record.data.estado == '1') {
                if (item.obs) {
                    item.enable();
                } else {
                    item.setDisabled(this.record && parseInt(this.record.data.cantproductos) > 0);
                }
            } else {
                item.disable();
            }
        }, this.winGestionarDocumento);
    },
    /**
     *
     * @returns {undefined}
     */
    handlerEliminarMov: function () {
        var _scope = this;
        var _parent = this.scope;
        var idmovimientos = new Array();
        Ext.each(_scope.smGridDetalles.getSelections(), function (rec) {
            idmovimientos.push(rec.id);
        });
        _scope.modelo.eliminarMovimientos(idmovimientos, function (r) {
            Ext.apply(_scope.record.data, {cantproductos: r.cantproductos});
            _scope.stGridDetalles.reload();
            _parent.habilitarElementos();
        });
    },
    /**
     * Carga los datos para realizar las transferencias.
     * @param {Object} datos
     * @returns {undefined}
     */
    cargarDatosUbicacion: function (datos, origen, ambos) {
        var elementos = document.getElementsByTagName('lb');
        for (var i = 0; i < elementos.length; i++) {
            if (origen || ambos) {
                if (elementos[i].getAttribute('class') == 'existenciaorigen') {
                    elementos[i].innerHTML = parseFloat(datos.cantidad) || '-';
                }
                if (elementos[i].getAttribute('class') == 'disponibleorigen') {
                    elementos[i].innerHTML = parseFloat(datos.disponible) || '-';
                }
            }
            if (!origen || ambos) {
                if (elementos[i].getAttribute('class') == 'existenciadestino') {
                    elementos[i].innerHTML = parseFloat(datos.cantidad) || '-';
                }
                if (elementos[i].getAttribute('class') == 'disponibledestino') {
                    elementos[i].innerHTML = parseFloat(datos.disponible) || '-';
                }
            }
        }
    },
    /**
     * Genera el reporte de especificado de la transferencia entre areas.
     * @param {type} btn
     * @returns {undefined}
     */
    getParamsReport:function (record, btn) {
      //  console.info(record.data);
      //  console.info(this.getStorePrincipal().baseParams);
        return btn.isList ? {
        idestado: this.cmbEstado.getValue() || null,
        //tipotransferencia: this.cmbTipoTranferencia.getValue() || null,
        areaorigen: this.cmbAreaOrigen.getValue() || null,
        areadestino: this.cmbAreaDestino.getValue() || null,
        fechainicio: this.dfFechaInicio.getValue() ? this.dfFechaInicio.getValue().format('d/m/Y') : null,
        fechafin: this.dfFechaFin.getValue() ? this.dfFechaFin.getValue().format('d/m/Y') : null,
        creadopor: this.cmbUsuarioCreadoPor.getValue() || null,
        aprobadopor: this.cmbUsuarioAprobadoPor.getValue() || null
        } : {
            iddocumento: record.get("iddocumento")
        };
    }
});


/**
 * Plantilla tipo panel
 * @type LOG.util.UITemplate
 */
LOG.inv.transferenciainterna.Transferencia = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.urlBusquedaGridPrincipal = 'cargarMovTransferencia';
        this.autoLoad = false;
        this.modoSeleccion = 1;
        LOG.inv.transferenciainterna.Transferencia.superclass.constructor.call(this, config);
    },
    /**
     * Inicializa las columnas de la ventana.
     * @returns {undefined}
     */
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'idmovtransferencia'});
        this.addGridColumn({dataIndex: 'idmovubicacion'});
        this.addGridColumn({dataIndex: 'idubicacionorigen'});
        this.addGridColumn({dataIndex: 'idubicaciondestino'});
        this.addGridColumn({dataIndex: 'idmovtransferenciamunic'});
        this.addGridColumn({dataIndex: 'idpartidaorigen'});
        this.addGridColumn({dataIndex: 'idpartidadestino'});

        this.addGridColumn({
            header: 'Ubicaci\xf3n origen',
            dataIndex: 'origen',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: 'Ubicaci\xf3n destino',
            dataIndex: 'destino',
            width: 150,
            default: true
        });
        if (this.partida) {
            this.addGridColumn({
                header: 'Estiba',
                dataIndex: 'estiba',
                width: 80,
                default: true
            });
            this.addGridColumn({
                header: 'Hilera',
                dataIndex: 'hilera',
                width: 80,
                default: true
            });
        }
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            width: 120,
            default: true
        }));
    },
    /**
     * Programa los eventos, renderiza el componente y devuelve la vista.
     * @param {Object} config
     * @returns {vistaPrincipal}
     */
    render: function () {
        var render = LOG.inv.transferenciainterna.Transferencia.superclass.render.call(this);
        var _this = this;
        this.getStorePrincipal().on({
            beforeload: function () {
                this.initBaseParams.idmovimiento = _this.idmovimiento;
                this.initBaseParams.partida = _this.partida || null;
            }
        });
        return render;
    }
});