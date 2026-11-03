/**
 * @class solicitudentrega.View
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Salida
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('LOG.inv.salida.solicitudentrega');
LOG.inv.salida.solicitudentrega.View = Ext.extend(LOG.lb.documento.View, {
    name: 'SolicitudEntrega',
    cantSign: 2,
    signDetails: {
        1: 'Elaborado',
        2: 'Aprobado'
    },
    dirReport: '/logistica/inventario/salida/entrega/',
    constructor: function (config) {
        this.concepto = config.idioma.ttBtnBuscar;
        this.busquedaBasica = true;
        this.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.modoSeleccion = 1;
        config.model = new LOG.inv.salida.documentoSolicitudentrega.Model({
            idioma: config.idioma
        });
        LOG.inv.salida.solicitudentrega.View.superclass.constructor.call(this, config);
    },
    init: function () {
        LOG.inv.salida.solicitudentrega.View.superclass.init.call(this);
        this.panelSuperior();
    },
    initDefaultButtons: function () {
        LOG.inv.salida.solicitudentrega.View.superclass.initDefaultButtons.call(this);
        var _this = this;

        this.listaBotones.getItem(0).handler = this.listaBotones.getItem(0).handler.createSequence(function (e) {
            _this.habilitarElementos();
        });
        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            _this.habilitarElementos();
            _this.cargarDatosEncabezados(_this.getSmPrincipal().getSelected().json);
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {id: 'idSolicitudentrega'});

        // Bloque de botones de la interfaz principal.
        this.insertToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.confirmar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'confirmar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 3);
        this.insertToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            text: this.idioma.lbBtnAnularEstado,
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.anularestado();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 2) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'anularEstado1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 4);
        this.insertToolbarButton(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            disabled: true,
            handler: function () {
                _this.initVentanaGestion(_this.getGridPrincipal().getSelectionModel().getSelected(), 3);
                _this.habilitarElementos();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            b.setDisabled(!(
                            (this.getCount() == 1 && this.getSelected().data.estado == 2) && //first
                            ((window.useSign && typeof pki == 'object') ? (_caller.getSmPrincipal().getSelected().get('controlfirma') == 2) : true) //last pki //para controlfirma == 2 limit 3 y 1 limit 2
                            ));
                        }
                    }, 'aprobar1');
                } else {
                    b.setVisible(false);
                }
            },
            isContextual: true
        }), 5);
        this.insertToolbarButton(LOG.util.Prototipos.botonDuplicar({
            tooltip: this.idioma.ttBtnDuplicar,
            disabled: true,
            handler: function () {
                _this.modelo.duplicar();
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                    b.setVisible(true);
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
                    b.setVisible(false);
                }
            },
            isContextual: true
        }), 6);
        // Bloque de botones de la ventana adicionar.
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(0), {
            tooltip: this.idioma.ttBtnEliminarDoc,
            handler: function () {
                _this.modelo.eliminar(null, function () {
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
                        if (!_this.modelo.iddocumento) {
                            b.disable();
                        } else {
                            if (_this.winGestionarDocumento.record.data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(1), {
            tooltip: this.idioma.ttBtnConfirmar,
            handler: function () {
                _this.modelo.confirmar(_this.winGestionarDocumento.record.data, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = '2';
                    _this.habilitarElementos();
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.modelo.habilitarBotones(true);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (!_this.modelo.iddocumento) {
                            b.disable();
                        } else {
                            if (_this.winGestionarDocumento.record.data.estado == '1') {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        LOG.util.UIManager.apply(this.winGestionarDocumento.listaBotonesVentana.getItem(2), {
            tooltip: this.idioma.ttBtnAnularEstado,
            handler: function () {
                _this.modelo.anularestado(_this.winGestionarDocumento.record.data, function (r) {
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.record.data.estado = '1';
                    _this.habilitarElementos();
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    _this.modelo.habilitarBotones(true);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (!_this.modelo.iddocumento) {
                            b.disable();
                        } else {
                            if (_this.winGestionarDocumento.record.data.estado == '2') {
                                b.enable();
                            } else {
                                b.disable();
                            }
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
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        _this.winGestionarDocumento.close();
                    } else {
                        _this.winGestionarDocumento.cargarProductos();
                        _this.winGestionarDocumento.record.data.estado = '3';
                        _this.habilitarElementos();
                        _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                            }
                        }, _this.winGestionarDocumento);
                        _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RAprobar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.record && _this.winGestionarDocumento.record.data.estado == '2') {
                        b.enable();
                    } else {
                        b.disable();
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
                    _this.winGestionarDocumento.record = {};
                    Ext.apply(_this.winGestionarDocumento.record, {
                        data: {
                            iddocumento: r.iddocumento,
                            estado: '1',
                            observaciones: r.observaciones
                        }
                    });
                    Ext.apply(_this.modelo, _this.winGestionarDocumento.record.data);
                    _this.habilitarElementos();
                    _this.winGestionarDocumento.cargarProductos();
                    _this.winGestionarDocumento.fromularioGestion.getForm().loadRecord(_this.winGestionarDocumento.record);
                    _this.winGestionarDocumento.listaBotonesVentana.each(function (b) {
                        LOG.util.UIManager.applyKey(b, _this.winGestionarDocumento);
                        if (typeof b.controlFn == 'function') {
                            b.controlFn.createDelegate(_this.winGestionarDocumento, [b, _this.winGestionarDocumento]).call();
                        }
                    }, _this.winGestionarDocumento);
                    _this.winGestionarDocumento.getTitleDocumento(_this.modelo.iddocumento);
                });
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (_this.winGestionarDocumento.tipoVentana == 3) {
                        b.hide();
                    } else {
                        b.show();
                        if (!_this.modelo.iddocumento) {
                            b.disable();
                        } else {
                            b.enable();
                        }
                    }
                } else {
                    b.setVisible(false);
                }
            }
        });
        //Fin del bloque

        this.winGestionarDocumento.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            hidden: true,
            handler: function () {
                _this.modelo.anularestado(null, function () {
                    _this.winGestionarDocumento.close();
                });
            },
            controlFn: function (b, _caller) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAnularestado'))
                    && _this.winGestionarDocumento.tipoVentana == 3) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));

        // Bloque de botones del panel de productos de la ventana adicionar.
        var btnProductos = LOG.util.UIManager.createBtn({
            iconCls: 'producto',
            text: this.idioma.lbBtnProductos,
            tooltip: this.idioma.ttBtnProductos,
            handler: function () {
                var winProductos = new LOG.lb.documento.VentanaProductos({
                    idioma: _this.idioma,
                    _parent: _this,
                    parametros: {
                        idestructura: _this.idDeposito,
                        iddocumento: _this.modelo.iddocumento
                    },
                    postSalvar: function (r) {
                        var _scope = _this.winGestionarDocumento;
                        _scope.cargarProductos();
                        if (_scope.record == null) {
                            _scope.record = {};
                            Ext.apply(_scope.record, {
                                data: {
                                    iddocumento: r.iddocumento,
                                    estado: "1"
                                }
                            });

                        } else {
                            _scope.record.data.estado = "1";
                        }
                        _scope.getTitleDocumento(_scope.record.data.iddocumento);
                        _scope.listaBotonesVentana.each(function (b) {
                            LOG.util.UIManager.applyKey(b, _scope);
                            if (typeof b.controlFn == 'function') {
                                b.controlFn.createDelegate(_scope, [b, _scope]).call();
                            }
                        }, _scope);

                        _scope.modelo.getStore().reload();
                        winProductos.getStorePrincipal().reload();
                    }
                });
                winProductos.init();
                _this.vistaProductos = winProductos.view();
                _this.vistaProductos.show();
            },
            fnEspecialCondition: function () {
                if ((!_this.winGestionarDocumento.record || (_this.winGestionarDocumento.record &&
                    _this.winGestionarDocumento.record.data.estado == '1')) && (_this.modelo.basicForm && _this.modelo.basicForm.isValid())) {
                    return false;
                }
                return true;
            },
            controlFn: function (b) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && _this.winGestionarDocumento.tipoVentana != 3) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        this.insertToolbarButtonProductos(btnProductos, 0);
        this.modelo.addActionButton(btnProductos, true);

        this.winGestionarDocumento.listaBotonesProductos.getItem(1).tooltip = this.idioma.ttBtnEliminarProducto;
        this.winGestionarDocumento.listaBotonesProductos.getItem(1).controlFn = function (b, _caller) {
            if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                && _this.winGestionarDocumento.tipoVentana != 3) {
                b.setVisible(true);
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.smGridDetalles, 'fireEvent', function (e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() > 0 && _this.winGestionarDocumento.record.data.estado == '1') {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'eliminar');
            } else {
                b.setVisible(false);
            }
        }
        this.listaBotonesVentana.delete(4);
        // Fin del bloque.
    },
    initDefaultColumns: function () {
        LOG.inv.salida.solicitudentrega.View.superclass.initDefaultColumns.call(this);
        this.addGridColumn({
            dataIndex: 'controlfirma',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnodo',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddoc',
            default: true
        });
        this.insertGridColumn({
            header: this.idioma.cgCentrocosto,
            autoExpand: true,
            dataIndex: 'descripcliente',
            default: true
        }, 3);
        this.insertGridColumn({
            dataIndex: 'codigocliente',
            default: true
        }, 3);
		this.insertGridColumn({
            header: this.idioma.gcTipoDocOrigen,
            dataIndex: 'tipoDoc',
            width: 150,
            default: true
        }, 6);
        this.insertGridColumn({
            header: this.idioma.gcDocOrigen,
            dataIndex: 'nroDoc',
            width: 100,
            align: 'right',
            default: true
        }, 7);
    },
    /**
     * @param {Integer} tipoVentana
     * @param {Boolean} noCargar
     * @returns {undefined}
     */
    initVentanaGestion: function (d, tipoVentana, noCargar) {
        var _this = this;
        Ext.apply(this.winGestionarDocumento, {
            controlFnGuardar: function (b, nuevo) {
                if ((_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar'))
                    && (!_this.winGestionarDocumento.record
                    || nuevo && (_this.winGestionarDocumento.record.data.estado != '3')
                    || (!nuevo && _this.winGestionarDocumento.record.data.estado == '1')
                    )
                ) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }, this.winGestionarDocumento);
        LOG.inv.salida.solicitudentrega.View.superclass.initVentanaGestion.call(this, d, tipoVentana, noCargar);
        LOG.util.UIManager.encadenaFn(this.winGestionarDocumento.btnNuevo, 'handler', function () {
            _this.winGestionarDocumento.tipoVentana = 1;
            _this.winGestionarDocumento.record = null;
            _this.habilitarElementos();
        }, 'nuevoHabilitar');
    },
    panelSuperior: function () {
        var _this = this;
		
		var fsDatosOrigen = new Ext.form.FieldSet({
            title: this.idioma.lbFsDatosOrigen,
            items: [{
                html: '<table width="100%">' + '<tr style="font-weight: bold;">' + '  <td width="33%">' + _this.idioma.lbTipoDocumento + '</td>' + '   <td width="33%">' + _this.idioma.lbNroDocumento + '</td>' + '   <td width="33%">' + _this.idioma.lbFechaCreacion + '</td>' + '</tr>' + '<tr>' + '   <td class="tipoDoc"></td>' + '   <td class="nroDoc"></td>' + '   <td class="fecha"></td>' + '</tr>' + '</table>'
            }]
        });

        var codigo = new Ext.form.TextField({
            fieldLabel: this.idioma.lbCodigo,
            name: 'codigocliente',
            width: '98%',
            readOnly: true,
            editable: false,
            campo: true
        });
        var panel = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
		
        panel.addComponent(new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCentrocosto,
            name: 'descripcliente',
            url: 'cargarComboCentroCosto',
            valueField: 'idcentrogrupo',
            displayField: 'descripcioncentrogrupo',
            width: '98%',
            allowBlank: false,
            campo: true,
            listeners: {
                'select': function (index, rc) {
                    codigo.setValue(rc.json.codigocentrogrupo);
                }
            }
        }));
        panel.addComponent(codigo);
		
		var panelGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
		
		panelGeneral.addComponent(fsDatosOrigen);
		
		panelGeneral.addComponent(panel);
		
        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [
                panelGeneral,
                new Ext.form.TextArea({
                    fieldLabel: _this.idioma.lbObservaciones,
                    name: 'observaciones',
                    width: '98%',
                    minLength: 2,
                    maxLength: 255,
                    campo: true
                })
            ]
        });
        return this.formularioGeneral;
    },
    habilitarElementos: function () {
        if (this.winGestionarDocumento.tipoVentana == 3) {
            this.winGestionarDocumento.panelSuperior.setVisible(true);
            this.winGestionarDocumento.doLayout();
        } else if (!this.winGestionarDocumento.record) {
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
//        this.winGestionarDocumento.buttons[1].setVisible((!this.winGestionarDocumento.record || this.winGestionarDocumento.record.data.estado < 3));
//        this.winGestionarDocumento.buttons[2].setVisible((!this.winGestionarDocumento.record || this.winGestionarDocumento.record.data.estado == 1));
        Ext.each(this.winGestionarDocumento.panelSuperior.find('campo', true), function (item) {
            item.setDisabled((this.winGestionarDocumento.record && this.winGestionarDocumento.record.data.estado != 1));
        }, this);
        this.winGestionarDocumento.onShowHandler();
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null

        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    },
    cargarDatosEncabezados: function (datos) {
        var elementos = document.getElementsByTagName('td');
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].getAttribute('class') == 'tipoDoc') {
                elementos[i].innerHTML = datos.tipoDoc || '-';
            }
            if (elementos[i].getAttribute('class') == 'nroDoc') {
                elementos[i].innerHTML = datos.nroDoc || '-';
            }
            if (elementos[i].getAttribute('class') == 'fecha') {
                elementos[i].innerHTML = datos.fecha || '-';
            }
        }
    }
});
