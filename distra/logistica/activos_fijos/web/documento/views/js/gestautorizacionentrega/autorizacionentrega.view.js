/**
 * Created by yoendy on 10/27/2015.
 */
Ext.ns('LOG.aft.autorizacionentrega');

LOG.aft.autorizacionentrega.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        config.urlBusquedaGridPrincipal = 'cargardocumentos';
        config.autoLoad = false;
        this.idioma = config.idioma;
        this.modoSeleccion = 1;
        _this.concepto = config.idioma.concepto;
        LOG.aft.autorizacionentrega.View.superclass.constructor.call(this, config);
        this.model = new LOG.aft.autotizacion.Model({
            idioma: config.idioma,
            scope: _this
        });
    },
    initDefaultColumns: function() {
        var _this = this;
        /* this.addGridColumn({
         header: _this.idioma.cgTipoDocumento,
         width: 160,
         dataIndex: 'tipodistribucion',
         autoExpand: true,
         default: true
         });*/
        this.addGridColumn({
            header: _this.idioma.cgNumeroDocumento,
            width: 150,
            align: 'right',
            dataIndex: 'nrodoc',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nrodoc'
            }
        });
        this.addGridColumn({
            header: _this.idioma.cgNumeroReferencia,
            width: 150,
            align: 'right',
            dataIndex: 'numeroref',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'numeroref'
            }
        });
        this.addGridColumn({
            header: _this.idioma.cgfechaCreacion,
            width: 130,
            align: 'right',
            dataIndex: 'fechacontable',
            default: true,
        });
        this.addGridColumn({
            header: _this.idioma.cgActivos,
            width: 130,
            align: 'right',
            dataIndex: 'activos',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdClientes,
            width: 110,
            align: 'right',
            dataIndex: 'clientes',
            // renderer: renderGetuserAprobado,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdCreador,
            width: 130,
            dataIndex: 'usuario',
            // renderer: renderGetuser,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.hdAprobador,
            width: 110,
            dataIndex: 'aprobadopor',
            // renderer: renderGetuserAprobado,
            default: true
        });

        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'tipodoc',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.hdestado,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'observaciones',
            default: false
        });

    },
    initDefaultButtons: function() {
        var _this = this;

        this.adicionarBtn = new LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.lbTtBtnAdicionar,
            handler: function() {

                var fn = function(iddocumento) {
                    var winAdd = new LOG.aft.autorizacionentrega.ViewAdd({
                        idioma: _this.idioma,
                        scope: _this,
                        adicionar: true,
                        iddocumento: iddocumento
                    });
                    winAdd.show();
                    winAdd.maximize();
                }

                _this.model.getAdicionarDoc(false, false, fn);
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idAdicionarBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.adicionarBtn);

        this.modificarBtn = new LOG.util.Prototipos.botonModificar({
            tooltip: _this.idioma.lbTtBtnModificar,
            disabled: true,
            handler: function() {
                _this.modificarBtnAction();
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idModificarBtn')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.modificarBtn);

        this.eliminarBtn = new LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.lbTtBtnEliminar,
            disabled: true,
            handler: function() {
                var iddoc = new Array();
                mostrarMensaje(2, _this.idioma.lbMsgConfirmarEliminar, function(btn) {
                    if (btn == 'ok') {
                        Ext.each(_this.gpPrincipal.getSelectionModel().getSelections(), function(r) {
                            iddoc.push(r.data.iddocumento);
                        });
                        var fn = function(rd) {
                            if (rd.msg == 1) {
                                mostrarMensaje(2, _this.idioma.lbMsgEliminar)
                                _this.getStorePrincipal().load();
                            }
                        }
                        _this.model.eliminarDoc(iddoc, fn);
                    }
                });

                //  _this.model.eliminarDoc();


                /*   var record = _this.gpPrincipal.getSelectionModel().getSelected();
                 if ((record.get('codigooperacion') == "OPER_AJUSTE_SOBRANTE") || (record.get('codigooperacion') == "OPER_AJUSTE_FALTANTE")) {
                 _this.model.getExisteDocAjustesInventario(record.get('iddocumento'));
                 } else {
                 _this.model.eliminarDocumento();
                 }
                 */
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idEliminarBtn')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.eliminarBtn);

        this.confirmarBtn = new LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.lbTtBtnConfirmar,
            disabled: true,
            key: {
                ctrl: true,
                alt: true,
                shift: false,
                key: 'F'
            },
            handler: function() {
                var iddocc = new Array();
                mostrarMensaje(2, _this.idioma.lbMsgConfirmar, function(btn) {
                    if (btn == 'ok') {
                        Ext.each(_this.gpPrincipal.getSelectionModel().getSelections(), function(r) {
                            iddocc.push(r.data.iddocumento);
                        });
                        _this.model.confirmarDoc(iddocc, _this);
                    }
                });

            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idConfirmarBtn')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.confirmarBtn);

        this.aprobarBtn = new LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.lbTtBtnAprobar,
            key: {
                key: "Q",
                shift: false,
                alt: true,
                ctrl: false
            },
            disabled: true,
            handler: function() {
                var iddocc = new Array();
                mostrarMensaje(2, _this.idioma.lbMsgAprobar, function(btn) {
                    if (btn == 'ok') {
                        Ext.each(_this.gpPrincipal.getSelectionModel().getSelections(), function(r) {
                            iddocc.push(r.data.iddocumento);
                        });
                        _this.model.getAprobarDoc(iddocc, _this);
                    }
                });

            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idAprobarBtn')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.aprobarBtn);

        this.cancelEstatusBtn = new LOG.util.Prototipos.botonAnularEstado({
            text: _this.idioma.lbCancelarEstatusBtn,
            disabled: true,
            handler: function() {
                var iddocc = new Array();
                mostrarMensaje(2, _this.idioma.lbMsgAnular, function(btn) {
                    if (btn == 'ok') {
                        Ext.each(_this.gpPrincipal.getSelectionModel().getSelections(), function(r) {
                            iddocc.push(r.data.iddocumento);
                        });
                        _this.model.getAnularDoc(iddocc, _this);
                    }
                });
            },
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('idCancelEstatusBtn')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.addToolbarButton(_this.cancelEstatusBtn);

        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'iddocumentoaft'
        }));
    },
    render: function() {
        var vista = LOG.aft.autorizacionentrega.regnumerico.superclass.render.call(this);
        var _this = this;
        _this.smGridPrincipal.on({
            'rowselect': function(sm, index) {
                _this.activarBotones();
            },
            'rowdeselect': function(sm) {
                _this.activarBotones();
            }
        });
        _this.getStorePrincipal().load();
        return vista;
    },
    activarBotones: function() {
        var _this = this;
        if (_this.gpPrincipal.getSelectionModel().getSelected()) {
            var record = _this.gpPrincipal.getSelectionModel().getSelected();

            switch (_this.gpPrincipal.getSelectionModel().getSelected().get('estado')) {
                case '0':
                    {
                        this.modificarBtn.enable();
                        this.eliminarBtn.enable();
                        this.confirmarBtn.disable();
                        this.aprobarBtn.disable();
                        this.cancelEstatusBtn.disable();
                    }
                    break;

                case '1':
                    {
                        this.modificarBtn.enable();
                        this.eliminarBtn.enable();
                        this.confirmarBtn.enable();
                        this.aprobarBtn.disable();
                        this.cancelEstatusBtn.disable();
                    }
                    break;
                case '2':
                    {
                        this.modificarBtn.disable();
                        this.eliminarBtn.disable();
                        this.confirmarBtn.disable();
                        this.aprobarBtn.enable();
                        this.cancelEstatusBtn.enable();
                    }
                    break;
                case '5':
                    {
                        this.modificarBtn.disable();
                        this.eliminarBtn.disable();
                    }
                    break;
                default :
                    {
                        this.modificarBtn.enable();
                        this.eliminarBtn.disable();
                        this.confirmarBtn.disable();
                        this.aprobarBtn.disable();
                        this.cancelEstatusBtn.disable();
                    }
            }
        } else {

            this.modificarBtn.disable();
            this.eliminarBtn.disable();
            this.confirmarBtn.disable();
            this.aprobarBtn.disable();
            this.cancelEstatusBtn.disable();
        }
        this.adicionarBtn.enable();

    },
    onGridDobleClick: function() {
        var _this = this;

        if (_this.gpPrincipal.getSelectionModel().getSelected().get('estado') == 2 || _this.gpPrincipal.getSelectionModel().getSelected().get('estado') == 1 ||
                _this.gpPrincipal.getSelectionModel().getSelected().get('estado') == 0) {
            _this.modificarBtnAction();
        }
    },
    modificarBtnAction: function() {
        var _this = this;
        var winAdd = new LOG.aft.autorizacionentrega.ViewAdd({
            idioma: _this.idioma,
            scope: _this,            
            iddocumento: _this.gpPrincipal.getSelectionModel().getSelected().get('iddocumento'),
            modificar: "modificar"
        });
        winAdd.show();
        winAdd.maximize();
    }
});

