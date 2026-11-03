Ext.ns('LOG.dist.distribucion');
LOG.dist.distribucion.winAnularAsignaciones = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function (config) {
        this.busquedaBasica = true;
        this.dirController = '/logistica/distribucion/distribucion/index.php/distribucion';
        this.urlBusquedaGridPrincipal = 'devorlverProductosAnulacion';
        this.autoLoad = false;
        this.textBusquedaSimple = config.idioma.lbCampoBusquedaSimple;
        this.modoSeleccion = 1;
        this.formaVisualizacion = 'ventana';
        config.gridEditable = true;
        config.idGridPrincipal = 'idgridcantidad';
        config.idioma = LOG.util.UIManager.apply(LOG.dist.distribucion.Idioma, LOG.util.Idioma);
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        this.concepto = config.idioma.lbconcepto;
        this.iddocumento = config.iddocumento;
        LOG.dist.distribucion.winAnularAsignaciones.superclass.constructor.call(this, config);
        this.modelo = new LOG.dist.distribucion.Model({
            idioma: config.idioma
        });
        this.modelo.iddocumento = this.iddocumento;
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;
        this.setTitulo();
    },
    render: function () {
        var _this = this;
        var vista = LOG.dist.distribucion.winAnularAsignaciones.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.iddocumento = this.iddocumento;
        this.getStorePrincipal().initBaseParams.tipocliente = 1;
        this.getStorePrincipal().load();

        this.getSmPrincipal().moveEditorOnEnter = false;

        this.getGridPrincipal().on({
            'afteredit': function (e) {
                if (parseFloat(e.record.data.cantidad) < parseFloat(e.value)) {
                    mostrarMensaje(3, _this.idioma.msgErrorAnulacion);
                    e.record.data.cancelar = e.originalValue;
                    e.grid.view.refresh();
                    if (e.record.data.cancelar == e.record.json.cancelar) {
                        _this.getStorePrincipal().commitChanges();
                    }
                } else {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }
                var modified = _this.getStorePrincipal().getModifiedRecords();
                Ext.each(modified, function(rec) {
                   if (rec.data.motivo == null || rec.data.motivo == "") {
                       //_this.getVistaPrincipal().listaBotones.getItem(2).disable();
                   }
                });
            },
            'beforeedit': function (e) {
                if (_this.record && _this.record.data.estado == '10') {
                    e.cancel = true;
                } else {
                    e.cancel = false;
                }
                if (e.record.data.asigcancelada == 1) {
                    _this.listaBotones.getItem(0).enable();
                } else {
                    _this.listaBotones.getItem(0).disable();
                }
            }
        });

        this.getStorePrincipal().on({
            beforeload: function () {
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        });
        return vista;
    },
    init: function () {
        LOG.dist.distribucion.winAnularAsignaciones.superclass.init.call(this);
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultColumns: function () {
        var _this = this;
        let isFarmacia = typeof farmacia !== "undefined" && farmacia == 1;
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 100,
            dataIndex: 'numeropieza',
            default: true
        });

        if(isFarmacia == 1) {
            this.addGridColumn({
                header: 'Nº. lote',
                width: 150,
                dataIndex: "numerolote",
                default: true,
                filter: {
                    type: "string",
                    emptyText: 'N\xfamero de lote',
                    dataIndex: "numerolote",
                },
            });

            this.addGridColumn({
                header: 'Fecha vencimiento lote',
                width: 100,
                dataIndex: "fechavencelote",
                default: true
            });
        }

        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });

        this.addGridColumn({dataIndex: 'idprodorden'});

        this.addGridColumn({dataIndex: 'cantidad'});

        this.addGridColumn({
            header: _this.idioma.cgCliente,
            width: 200,
            dataIndex: 'cliente',
            agrupador: true,
            hidden: true,
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgUM,
            width: 100,
            dataIndex: 'umedida',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgAutorizado,
            width: 120,
            dataIndex: 'cantidad',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgEntregado,
            width: 120,
            dataIndex: 'entregado',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgPropuestoAnular,
            width: 130,
            dataIndex: 'propuestoanular',
            align: 'right',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgCantidadAnular,
            width: 120,
            dataIndex: 'cancelar',
            align: 'right',
            default: true,
            editor: new LOG.util.Prototipos.inputDecimal()
        });

        this.addGridColumn({
            header: 'Motivo',
            width: 200,
            dataIndex: 'motivo',
            default: true,
            editor: new LOG.util.Prototipos.inputTexto()
        });
    },
    initDefaultButtons: function () {
        var _this = this;

        this.listaBotones.add(LOG.util.UIManager.createBtn({
            iconCls: 'cancelar',
            text: 'Cancelar distribuci\xf3n',
            tooltip: 'Cancelar distribuci\xf3n completa',
            disabled: true,
            handler: function () {
                var anulObservaciones = new Ext.form.TextArea({
                    fieldLabel: 'Motivo',
                    anchor: '99%',
                    allowBlank: true,
                    maxLength: '255'
                });

                _this.anularDocumento = new Ext.Window({
                    title: 'Confirmaci\xf3n',
                    width: 440,
                    height: 170,
                    modal: true,
                    resizable: false,
                    constrain: true,
                    items: new Ext.Panel({
                        frame: true,
                        autoHeight: true,
                        autoWidth: true,
                        bodyBorder: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [anulObservaciones]
                    }),
                    buttons: [{
                        text: 'Cancelar',
                        //tooltip: _this.idioma.lbTxtBtnCancelar,
                        iconCls: 'cancelar',
                        handler: function () {
                            _this.anularDocumento.close();
                        }
                    }, {
                        text: 'Aceptar',
                        //tooltip: _this.idioma.lbTxtBtnAAceptar,
                        iconCls: 'aceptar',
                        handler: function () {
                            if(anulObservaciones.isValid()){
                                Ext.MessageBox.wait('Cancelando asignaciones', _this.idioma.msgEspere || '...');
                                Ext.Ajax.request({
                                    url: 'cancelarAsignaciones',
                                    params: {
                                        iddocumento: _this.modelo.iddocumento,
                                        motivo: anulObservaciones.getValue()
                                    },
                                    success: function(response) {
                                        var data = Ext.decode(response.responseText);
                                        Ext.MessageBox.hide();
                                        if (data.success === true) {
                                            _this.getStorePrincipal().reload();
                                            _this.anularDocumento.close();
                                        }
                                    }
                                });
                            }

                        }
                    }]
                });
                _this.anularDocumento.show();
                _this.anularDocumento.center();
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RAnulartodo')) {
                    b.setVisible(true);
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            if (!_this.record || (_this.record && _this.record.data.estado == 3)) {
                                b.enable();
                            }
                        }
                    }, 'cancelar');
                } else {
                    b.setVisible(false);
                }
            }
        }), 0);

        this.listaBotones.add(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            handler: function () {
                this.setDisabled(true);
                var param = {};
                //_this.datos.estado = '10';
                param['iddocumento'] = _this.modelo.iddocumento;
                    _this.modelo.anularAsignacion(param, function () {
                    _this.record.data.estado = 10;
                    _this.setTitulo();
                    _this._parent.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RConfirmaranular')) {
                    b.setVisible(true);
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            if (!_this.record || (_this.record && _this.record.data.estado == 3) && _this.getStorePrincipal().reader.jsonData.asigcancelada == 1) {
                                 b.enable();
                            }
                        }
                    }, 'cancelar');
                } else {
                    b.setVisible(false);
                }
            }
        }), 1);

        this.listaBotones.add(LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            handler: function () {
                this.setDisabled(true);
                var param = {};
                param['iddocumento'] = _this.modelo.iddocumento;
                _this.modelo.anularestadodoc(param, function (resp) {
                    _this.record.data.estado = 3;
                    _this._parent.getStorePrincipal().reload();
                    _this.setTitulo();
                    if (resp.eliminado) {
                        _this.getVistaPrincipal().close();
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RAprobaranular')) {
                    b.setVisible(true);
                    b.disable(); LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            if (!_this.record || (_this.record && _this.record.data.estado == 10) && _this.getStorePrincipal().reader.jsonData.asigcancelada == 1) {
                                b.enable();
                            }
                        }
                    }, 'aprobarcancelar');
                } else {
                    b.setVisible(false);
                }
            }
        }), 2);

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            text: 'Cerrar'
        });
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: _this.idioma.ttBtnGuardarAnulacion,
            handler: function () {
                _this.actualizarCantidad();
                this.setDisabled(true);
            }
        }));
    },
    actualizarCantidad: function () {
        var _this = this;
        var valido = true;
        var arrayObj = new Array();
        var record = _this.storePrincipal.getModifiedRecords();
        Ext.each(record, function (rec) {
            if (rec.data.propuestoanular >= rec.data.cancelar) {
                arrayObj.push({
                    idprodorden: rec.data.idprodorden,
                    cantidad: rec.data.cantidad,
                    propuestocancelar: rec.data.propuestoanular,
                    cancelar: rec.data.cancelar,
                    motivo: rec.data.motivo
                });
            } else {
                valido = false;
            }
        });
        if (valido) {
            /*var param = {};
            _this.datos.estado = '10';
            param['iddocumento'] = _this.modelo.iddocumento;
            _this.modelo.anularAsignacion(param, function () {    
                _this.record.data.estado = 10;
                _this.setTitulo();
                _this.vista.getStorePrincipal().reload();
            });*/
            _this.modelo.salvarCantidadesAnular(arrayObj);
            _this.getStorePrincipal().commitChanges();
        } else {
            mostrarMensaje(3, _this.idioma.msgErrorAnulacion);
        }
    },
    setTitulo: function () {
        var _this = this;
        _this.documento = (_this.record.data.nrodoc) ? _this.record.data.nrodoc : _this.record.data.numeroref;
        this.getVistaPrincipal().setTitle(String.format(_this.idioma.tlVentanaAnularAsignacion, _this.documento, _this.record.data.fechacontable, LOG.lb.documento.Estado[_this.record.data.estado]));
    }
});
