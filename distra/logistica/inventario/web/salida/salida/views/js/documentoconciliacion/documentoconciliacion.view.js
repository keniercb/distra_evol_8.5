Ext.ns('LOG.inv.documentoconciliacion')
LOG.inv.documentoconciliacion.View = Ext.extend(LOG.lb.documento.View, {
    name: 'Conciliacion',
    cantSign: 2,
    signDetails: {
        1: 'Elaborado',
        2: 'Aprobado'
    },
    dirReport: '/logistica/inventario/salida/conciliacion/',
    winGestionarConciliacion: undefined,
    formularioGeneralConciliacion: null,
    tienetransferencia: null,
    datostransferencia: new Array(),
    constructor: function (config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.modoSeleccion = 1;
        this.concepto = config.idioma.ttBuscar;

        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        config.model = new LOG.inv.documentoconciliacion.Model({
            idioma: config.idioma
        });
        LOG.inv.documentoconciliacion.View.superclass.constructor.call(this, config);

        this.winGestionarDocumento = new LOG.inv.documentoconciliacion.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            height: 580,
            title: (config.idioma.tlAdicionar) ? config.idioma.tlAdicionar : config.idioma.tlVentanaGestion,
            width: 750
        });
        this.winGestionarConciliacion = new LOG.inv.documentoconciliacion.Conciliacion({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            height: 580,
            title: (config.idioma.tlAdicionar) ? config.idioma.tlAdicionar : config.idioma.tlVentanaGestion,
            width: 750
        });

    },
    initDefaultColumns: function () {
        var _this = this;
        LOG.inv.documentoconciliacion.View.superclass.initDefaultColumns.call(this);
        this.superior();
        //Columnas de la vista principal..
        this.addGridColumn({
            dataIndex: 'idconciliacion',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtransferencia',
            hidden: true
        });
        this.insertGridColumn({
            dataIndex: 'denominacion',
            default: true,
            renderer: function (v) {
                return 'Conciliación';
            }
        }, 1);
        this.insertGridColumn({
            header: this.idioma.gcCantidadTransferencia,
            width: 120,
            dataIndex: 'cantidadtrans',
            default: true
        }, 5);
        this.insertGridColumn({
            header: this.idioma.gcCliente,
            width: 150,
            dataIndex: 'cliente',
            default: true

        }, 6);
//        this.listaColumnas.delete(4);

        this.addGridColumn({
            header: this.idioma.gcConciliado,
            width: 100,
            dataIndex: 'conciliadopor',
            default: true,
            renderer: function (v) {
                return _this.getUsuarioById(v);
            }
        });
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
        Ext.apply(this.listaColumnas.getBy('dataIndex', 'cantproductos'), {
            hidden: true
        });
    },
    initVentanaConciliacion: function (d, tipoVentana) {
        if (!this.winGestionarConciliacion.isInit()) {
            this.winGestionarConciliacion.init();
            if (this.formularioGeneralConciliacion != null) {
                this.winGestionarConciliacion.addPanelSuperior(this.formularioGeneralConciliacion);
            }
            if (this.formularioSur != null) {
                this.winGestionarConciliacion.addPanel(this.formularioSur);
            }
            if (this.formularioEste != null) {
                this.winGestionarConciliacion.addPanel(this.formularioEste);
            }
            if (this.formularioOeste != null) {
                this.winGestionarConciliacion.addPanel(this.formularioOeste);
            }
        }
        this.winGestionarConciliacion.tipoVentana = tipoVentana || 1;

        if (d) {
            this.winGestionarConciliacion.prepareDocModify(d);
        }
        this.winGestionarConciliacion.show();
        this.winGestionarConciliacion.maximize();
    },
    initDefaultButtons: function () {
        LOG.inv.documentoconciliacion.View.superclass.initDefaultButtons.call(this);
        var _this = this;
        // Botones de la vista principal
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function () {

                _this.ventanaNuevo = new LOG.inv.documentoconciliacion.Nuevo({
                    idioma: _this.idioma,
                    iddeposito: _this.idDeposito
                });
                _this.ventanaNuevo.init();
                _this.ventanaNuevo.view();

                if (_this.tienetransferencia == 0) {
                    mostrarMensaje(1, _this.idioma.msgNoExisteTransferencia);
                } else if (_this.tienetransferencia == 1) {
                    // _this.ventanaNuevo.setModel(_this.modelo);
                    _this.modelo.crearDocumentoConciliacion(_this.datostransferencia, _this.idDeposito, function (datos) {
                        // datos.iddocumento.cliente = _this.datostransferencia.cliente;
                        _this.initVentanaGestion({data: datos}, 2);
                        _this.cargarDatosHTML(true, _this.datostransferencia[0].cliente);
                        _this.datostransferencia = new Array();
                    });
                } else {
                    _this.ventanaNuevo.getVistaPrincipal().show();
                    _this.ventanaNuevo.setModel(_this.modelo);
                    _this.ventanaNuevo.getVistaPrincipal().aceptarFn = function () {
                        _this.ventanaNuevo.handlerAdicionar(function (datos) {
                            if (_this.ventanaNuevo.getSmPrincipal().getSelections().length == 1) {
                                _this.initVentanaGestion({data: datos}, 2);
                                _this.cargarDatosHTML(true, _this.ventanaNuevo.getSmPrincipal().getSelected().data.cliente);

                            }

                        });
                    };
                }
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(4), {
            id: 'idConciliacion'
        });

        this.listaBotones.getItem(1).handler = this.listaBotones.getItem(1).handler.createSequence(function (e) {
            _this.cargarDatosHTML(true);
        });
        this.listaBotones.getItem(1).controlFn = this.listaBotones.getItem(1).controlFn.createSequence(function (b, _caller) {

            b.disable();
            _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (_caller.getGridPrincipal().getStore().getCount() == 0) {
                    b.disable();
                }
                if (e == 'rowselect') {
                    b.enable();
                }
                if (e == 'rowdeselect') {
                    b.disable();
                }
            });
        });

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
            isContextual: true,
            disabled: true,
            handler: function () {
                _this.modelo.aprobar();
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
            }
        }), 5);
        this.insertToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'conciliar',
            text: this.idioma.lbBtnConciliar,
            tooltip: this.idioma.ttBtnConciliar,
            isContextual: true,
            handler: function () {

                _this.initVentanaConciliacion(_this.getGridPrincipal().getSelectionModel().getSelected(), 2);
                _this.cargarDatosHTML(false);
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT')) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && this.getSelected().data.estado == 3) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    }, 'conciliar1');
                } else {
                    b.setVisible(false);
                }
            }
        }), 6);
    },
    render: function () {
        var _this = this;
        var render = LOG.inv.documentoconciliacion.View.superclass.render.call(this);

        this.getStorePrincipal().fireEvent = this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e == 'load') {

                _this.modelo.cargaInicial({
                    url: '/logistica/inventario/salida/salida/index.php/conciliacionlogistica/cargarClientesConTransferecia',
                    idestructuracomun: _this.idDeposito,
                    cargando: true
                }, function (r) {
                    _this.tienetransferencia = r[0].length;
                    if (_this.tienetransferencia == 1) {
                        var tmp = r[0][0];
                        var existe = false;
                        Ext.each(_this.datostransferencia, function (rec) {
                            if (rec.idcliente == tmp.idcliente) {
                                existe = true;
                                return;
                            }
                        });
                        if (!existe) {
                            _this.datostransferencia.push(r[0][0]);
                        }

                    }

                });
            }
        });
        return render;
    },
    getUsuarioById: function (id) {
        for (var i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].idusuario == id) {
                return this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    superior: function () {
        var _this = this;

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [
                {
                    html: '<table cellspacing="5">' +
                    '    <tr>' +
                    '        <td>Cliente: </td>' +
                    '        <td id="cliente"></td>' +
                    '    </tr>' +
                    '</table>'
                },
                new Ext.form.TextArea({fieldLabel: 'Observaciones', name: 'observaciones', width: '98%'})
            ]
        });

        //panel superior para conciliacion
        var cls = LOG.util.UIManager.initColumnForm({columnas: 3});

        cls.addComponent({
            html: '<table cellspacing="5">' +
            '    <tr>' +
            '        <td>Importe total: </td>' +
            '        <td id="importe"></td>' +
            '    </tr>' +
            '</table>'
        });
        this.formularioGeneralConciliacion = LOG.util.UIManager.initPanel({
            layout: 'form',
            labelAlign: 'top',
            items: [
                {
                    html: '<table cellspacing="5">' +
                    '    <tr>' +
                    '        <td>Cliente: </td>' +
                    '        <td id="cliente"></td>' +
                    '    </tr>' +
                    '</table>'
                },
                new Ext.form.TextArea({fieldLabel: 'Observaciones', name: 'observaciones', width: '98%'}),
                cls
            ]
        })
    },
    buildReport: function (btn, record) {
        btn.name = btn.isList ? btn.name : "ConciliacionModelo";
        return  LOG.inv.documentoconciliacion.View.superclass.buildReport.call(this,btn,record);
    },
    getParamsReport: function (record, btn) {
        var _this = this;
        return btn.isList ? {
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
            nivelaprobacion: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
            idcliente: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
            contabilizadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            conciliadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null,
            tipodocumento: (_this.panelBusquedaAvanzada.findByType('textfield')[7].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[7].getValue() : null,
            fechainiciotrasnf: (_this.panelBusquedaAvanzada.findByType('datefield')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[2].getValue().format('d/m/Y') : null,
            fechafintrasnf: (_this.panelBusquedaAvanzada.findByType('datefield')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[3].getValue().format('d/m/Y') : null
        } : {
            useSign: this.useSign,
            hasCategoria: (usarCategoria) ? 'true' : 'false',
            iddocumento: record.get("iddocumento") || null,
            iddeposito: _this.idDeposito ? _this.idDeposito : null,
            monedacontable: window.monedacontable || window.idcontable,
            monedaalternativa: window.monedaalternativa || window.idalternativa
        };
    },
    cargarDatosHTML: function (valor, cliente) {
        var _this = this;
        document.getElementById('cliente').innerHTML = cliente || _this.getGridPrincipal().getSelectionModel().getSelected().data.cliente;
        if (!valor) {
            var importetot = 0;
            _this.winGestionarConciliacion.stGridDetalles.on({
                load: function (s, record) {
                    Ext.each(record, function (rec) {
                        var imp = parseInt(rec.data.importe);
                        importetot += imp;
                    });
                    document.getElementById('importe').innerHTML = '$' + importetot;
                }
            });


        }
    }
});
