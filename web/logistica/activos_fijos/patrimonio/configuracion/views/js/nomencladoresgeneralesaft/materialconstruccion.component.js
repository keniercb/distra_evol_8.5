/**
 *  @author Rajiv Rondon Padilla
 *  28/02/2015
 */

Ext.erp.nommaterialconstruccion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function(config) {
        var _this = this;
        config.campoIdNomenclador = 'idtipoconstruccion';
        Ext.apply(this, config);
        this.codigo = false;
        // this.modelo = 'NomMaterialConstruccion';

        Ext.erp.nommaterialconstruccion.superclass.constructor.apply(this, arguments);
        this.btnAdicionarMConst = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.lbTtBtnAdicionarMConstruccion,
            iconCls: 'adicionar',
            disabled: true
        });

        this.btnModificarMConst = new Ext.Button({
            text: _this.idioma.lbBtnModificar,
            tooltip: _this.idioma.lbTtBtnModificarMConstruccion,
            iconCls: 'modificar',
            disabled: true
        });

        this.btnEliminarMConst = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminarMConstruccion,
            iconCls: 'eliminar',
            disabled: true
        });

        this.btnHabilitarMConst = new Ext.Button({
            text: _this.idioma.lbBtnHabilitar,
            tooltip: _this.idioma.tipBtnHabilitar,
            iconCls: 'habilitar',
            disabled: true
        });

        this.btnBuscarMConst = new Ext.Button({
            text: _this.idioma.lbBtnBuscar,
            tooltip: _this.idioma.tipBtnBuscarMConstruccion,
            iconCls: 'buscar'
        });

        this.btnLimpiarMConst = new Ext.Button({
            text: _this.idioma.lbBtnLimpiar,
            tooltip: _this.idioma.tipBtnLimpiarMConstruccion,
            iconCls: 'limpiar'
        });

        this.tfDenomMConst = new Ext.form.TextField({
            id: 'tfdenonmconst',
            maxLength: 255,
            maskRe: /^([a-zA-ZáéíóúñüÑ0-9-_/,.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/,.\s]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/,.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/,.\s]*)+$/,
            enableKeyEvents: true,
            regexText: 'Este valor es incorrecto.',
            listeners: {
                'valid': function(field) {
                    if (field.getValue().charAt(0) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                }
                            }

                        }
                    }
                }
            }
        });

        this.panelBotonesMConst = new Ext.Panel({
            tbar: [this.btnAdicionarMConst, this.btnModificarMConst, this.btnEliminarMConst, this.btnHabilitarMConst],
            border: false,
            region: 'north'
        });
        this.stMConst = new Ext.data.Store({
            url: '/logistica/activos_fijos/patrimonio/configuracion/index.php/nommaterialconstruccion/cargarnomenclador',
            baseParams: {
                modelos: true,
                modelo: 'NomMaterialConstruccion',
                idnom: _this.campoIdNomenclador,
                bussines: 'MaterialConstruccionModel'
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idmodelo',
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: 'idmaterialesconstruccion'
                    },
                    {
                        name: 'fechafin'
                    },
                    {
                        name: 'fechainicio'
                    }

                ]
            })
        });

        this.btnBuscarMConst.on({
            'click': function() {
                _this.buscarMaterialesConst = true;
                var objParams = {
                    start: 0
                };
                if (_this.tfDenomMConst.getValue()) {
                    objParams.denominacion = _this.tfDenomMConst.getValue();
                }

                _this.stMConst.reload({
                    params: objParams
                });
            }

        });

        this.btnLimpiarMConst.on({
            'click': function() {
                // _this.buscarModelos = false;
                _this.tfDenomMConst.reset();
                _this.stMConst.load({
                    params: {
                        start: 0,
                        denominacion: ''
                    }
                });
            }
        });

        this.btnHabilitarMConst.on({
            'click': function() {

                if (_this.smMConst.getCount() > 0) {
                    var idnomencladores = new Array();
                    mostrarMensaje(2, _this.idioma.lbMsgConfirmarHabilitarMC, function(btn) {
                        if (btn == 'ok') {
                            Ext.each(_this.smMConst.getSelections(), function(item) {
                                idnomencladores.push(item.data.idmaterialesconstruccion);
                            });
                            _this.onAceptarActivar(idnomencladores, function() {
                                _this.stMConst.reload();
                            }, _this.idioma.lbMsgMCActivado, 'NomMaterialConstruccion');
                        }
                    });
                }
            }
        });

        this.stMConst.on({
            'beforeload': function(st) {
                st.baseParams.idpadre = (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().id : -1;
            },
            'load': function(st, rec) {
                if (rec.length > 0) {
                    _this.smMConst.selectFirstRow();
                }
                else {
                    if (_this.buscarMaterialesConst) {
                        mostrarMensaje(1, _this.idioma.lbMsgNoMC);
                        _this.buscarMaterialesConst = false;
                    } else
                        mostrarMensaje(1, _this.idioma.lbMsgNoMaterialesAsociados);
                }
            }
        });

        this.selectionModeNomenclador.on({
            'rowselect': function(sm, rowIndex, r) {
                _this.stMConst.removeAll();
                _this.panelMConst.expand();
            }
        });

        this.smMConst = new Ext.grid.RowSelectionModel();

        this.cmMConst = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'No.',
                width: 30
            }), {
                header: _this.idioma.lbEstado,
                width: 55,
                dataIndex: 'estado',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }, {
                header: _this.idioma.lbDenominacionMConstruccion,
                dataIndex: 'denominacion',
                id: 'expndirmodelos'
            }, {
                header: 'Fecha inicio',
                dataIndex: 'fechainicio'
            }, {
                header: 'Fecha fin',
                dataIndex: 'fechafin'
            }
        ]);

        this.gridPanelMConst = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            tbar: ['', new Ext.menu.TextItem({
                    text: _this.idioma.lbDenominacionMConstruccion + ':'
                }), '', this.tfDenomMConst, '', _this.btnBuscarMConst, '', this.btnLimpiarMConst],
            autoExpandColumn: 'expndirmodelos',
            cm: _this.cmMConst,
            store: _this.stMConst,
            sm: _this.smMConst,
            loadMask: {
                store: _this.stMConst
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stMConst,
                displayInfo: true,
                pageSize: 5
            })
        });

        this.panelMConst = new Ext.Panel({
            region: 'south',
            collapsible: true,
            collapsed: true,
            split: true,
            collapseMode: 'mini',
            height: 240,
            layout: 'border',
            items: [this.panelBotonesMConst, this.gridPanelMConst]
        });

        this.add(_this.panelMConst);

        this.selectionModeNomenclador.on({
            'rowselect': function() {
                _this.activarBotones();
                _this.stMConst.load({params: {start: 0, limit: 5}});
                _this.panelMConst.expand();
            },
            'rowdeselect': function() {
                _this.activarBotones();
            }
        });

        _this.btnAdicionarMConst.on({
            'click': function() {

                _this.onBtnAdicionarClick();
                _this.fpGestionarNomenclador.getForm().on({
                    'beforeaction': function(fp, action) {

                        _this.fpGestionarNomenclador.getForm().baseParams = {
                            idpadre: _this.selectionModeNomenclador.getSelected() ? _this.selectionModeNomenclador.getSelected().id : null
                        };
                    }
                });

                _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionarMC);

                _this.btnAceptar.on({
                    'click': function() {
                        _this.onBtnAceptarClickMConst(false, function() {
                            mostrarMensaje(1, _this.idioma.lbMsgMCAdicionado);
                            _this.stMConst.reload();
                            _this.winGestionarNomenclador.close();
                        }, false, 'NomMaterialConstruccion');
                    }
                });

                _this.btnAplicar.on({
                    'click': function() {
                        _this.onBtnAceptarClickMConst(false, function() {
                            mostrarMensaje(1, _this.idioma.lbMsgMCAdicionado);
                            _this.stMConst.reload();
                            _this.fpGestionarNomenclador.getForm().reset();
                        }, false, 'NomMaterialConstruccion');
                    }
                });
            }
        });

        _this.btnModificarMConst.on({
            'click': function() {

                if (_this.smMConst.getSelected()) {

                    _this.onBtnAdicionarClick();
                    _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificarMC);
                    _this.fpGestionarNomenclador.getForm().loadRecord(_this.smMConst.getSelected());

                    _this.btnAceptar.on({
                        'click': function() {
                            _this.onBtnAceptarClickMConst(true, function() {
                                mostrarMensaje(1, _this.idioma.lbMsgMCModificado);
                                _this.stMConst.reload();
                                _this.winGestionarNomenclador.close();
                            }, false, 'NomMaterialConstruccion');
                        }
                    });
                    _this.btnAplicar.setVisible(false);
                } else {
                    mostrarMensaje(1, _this.idioma.lbMsgSeleccionarModificar);
                }
            }
        });


        _this.btnEliminarMConst.on({
            'click': function() {
                if (_this.smMConst.getCount() > 0) {

                    var idnomencladores = new Array();
                    Ext.each(_this.smMConst.getSelections(), function(item) {
                        idnomencladores.push(item.data.idmaterialesconstruccion);
                    });
                    _this.onAceptarEliminarMConst(idnomencladores, function() {
                        _this.stMConst.reload();
                    }, _this.idioma.lbMsgConfirmarEliminarMaterialConstruccion, _this.idioma.lbMsgMaterialConstruccionEliminado, _this.idioma.lbMsgErrorEliminadoMC, 'NomMaterialConstruccion');

                }
            }
        });


        this.smMConst.on({
            'rowselect': function() {
                _this.activarBotones();
            },
            'rowdeselect': function() {
                _this.activarBotones();
            }
        });

    },
    onBtnAdicionarClick: function() {
        var _this = this;
        Ext.erp.nommaterialconstruccion.superclass.onBtnAdicionarClick.call(this);
    },
    /*onAceptarActivar: function(idnomencladores, _fn, msg, materialconstruccion) {
     var _this = this;
     var msgOk = (msg) ? msg : _this.idioma.lbMsgNomencladorActivado;
     Ext.getBody().mask(_this.idioma.lbMsgActivandoNomenclador);
     Ext.Ajax.request({
     url: _this.urlController + 'activarnomenclador',
     params: {
     idnom: idnomencladores.join(','),
     pkid: (materialconstruccion) ? 'idmaterialesconstruccion' : 'idtipoconstruccion',
     modelo: (materialconstruccion) ? materialconstruccion : 'NomTipoConstruccion'
     },
     method: 'POST',
     callback: function(o, s, r) {
     var dataResp = Ext.decode(r.responseText);
     Ext.getBody().unmask();
     if (dataResp.success) {
     //mostrarMensaje(1, _this.idioma.lbMsgNomencladorActivado);
     mostrarMensaje(1, msgOk);
     if (typeof _fn == 'function') {
     _fn.call();
     }
     } else {
     mostrarMensaje(3, _this.idioma.lbMsgErrorActivar);
     }
     }
     });
     
     },*/
    onBtnAceptarClickMConst: function(modificar, _fn, msgerr, model) {
        var _this = this;

        var msgWait = (modificar == true) ? ((model == 'NomMaterialConstruccion') ? _this.idioma.lbMsgWaitModificadoMaterialCons : _this.idioma.lbMsgWaitModificado) : ((model == 'NomMaterialConstruccion') ? _this.idioma.lbMsgWaitAdicionadoMaterialConstruccion : _this.idioma.lbMsgWaitAdicionado);
        var url = '/logistica/activos_fijos/patrimonio/configuracion/index.php/nommaterialconstruccion/' + ((modificar == false) ? 'insertarnomenclador' : 'modificarnomenclador');
        var tempFp = _this.fpGestionarNomenclador.getForm();
        if (!tempFp.isValid()) {
            mostrarMensaje(1, _this.idioma.lbMsgCamposInvalidos);
            return;
        }
        if (modificar && !tempFp.isDirty()) {
            _this.winGestionarNomenclador.close();
            return;
        }

        var idmaterialesconstruccion = false;
        var itipoconstruccion2 = false;

        if (_this.gridPanelMConst.getSelectionModel().getSelected()) {
            idmaterialesconstruccion = _this.gridPanelMConst.getSelectionModel().getSelected().get('idmaterialesconstruccion');
        }

        if (_this.gridPanelNomenclador.getSelectionModel().getSelected()) {
            itipoconstruccion2 = _this.gridPanelNomenclador.getSelectionModel().getSelected().get(_this.campoIdNomenclador);
        }
        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST',
            params: {
                idnom: 'idmaterialesconstruccion', //_this.campoIdNomenclador,
                modelo: 'NomMaterialConstruccion',
                bussines: 'MaterialConstruccionModel',
                model: (model) ? model : 'NomTipoConstruccion',
                ditipoconstruccion2: itipoconstruccion2,
                iditipoconstruccion: itipoconstruccion2,
                idmaterialesconstruccion: idmaterialesconstruccion
            },
            success: function(form, action) {
                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function(form, action) {

                if (action.result.etiqueta && action.result.cod == '0') {
                    mostrarMensaje(1, (msgerr) ? msgerr : _this.idioma[action.result.etiqueta]);

                } else if (action.result.etiqueta && action.result.cod == '2') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '1') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);

                } else if (action.result.etiqueta && action.result.cod == '1' && action.result.modificar == 'true') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                }

                else if (action.result.etiqueta && action.result.cod == '2' && action.result.modificar == 'true') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                }

                else {
                    if (modificar) {
                        mostrarMensaje(2, _this.idioma.msjAddCodDescexist);

                    } else {
                        mostrarMensaje(2, _this.idioma[action.result.etiqueta], function(seleccion) {
                            if (seleccion == 'ok') {
                                _this.duplicarMarcaPorNaturaleza(action.result.idmarcamodelo, modificar, _fn, msgerr, action.result.origen);
                            }
                        });
                    }
                }
            }
        });
    },
    onAceptarEliminarMConst: function(idnomencladores, _fn, msgp, msgr, msge, modelo) {//msgp, msge y msgr se utiliza en casos como marca modelo

        var _this = this;
        mostrarMensaje(2, (msgp) ? msgp : '\xbfEst\xe1 seguro que quiere eliminar el(los) tipo(s) de construcci&oacute;n(es) seleccionado\x3f', function(btn) {
            if (btn == 'ok') {
                var lbMsgMascara = 'Eliminando material(es) de construccion(es)';
                if (!modelo) {
                    lbMsgMascara = 'Eliminando tipo(s) de construccion(es)';
                }

                Ext.getBody().mask(lbMsgMascara);
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/patrimonio/configuracion/index.php/nommaterialconstruccion/eliminarnomenclador',
                    params: {
                        idnom: Ext.encode(idnomencladores),
                        idtipoconstruccion: _this.gridPanelNomenclador.getSelectionModel().getSelected().get('idtipoconstruccion'),
                        pkid: (modelo) ? 'idmaterialesconstruccion' : 'idtipoconstruccion',
                        modelo: 'NomMaterialConstruccion',
                    },
                    method: 'POST',
                    callback: function(o, s, r) {
                        var dataResp = Ext.decode(r.responseText);
                        Ext.getBody().unmask();
                        if (dataResp.CodMsg == 1) {
                            mostrarMensaje(1, (msgr) ? msgr : _this.idioma.lbMsgNomencladorEliminado);

                        } else if (dataResp.CodMsg == 3) {
                            mostrarMensaje(3, (msge) ? msge : _this.idioma.lbMsgErrorEliminado);
                        }
                        if (typeof _fn == 'function') {
                            _fn.call();
                        }
                    }
                });
            }
        });
    },
    activarBotonesMateriales: function() {
        var _this = this;
        if (_this.selectionModeNomenclador.getCount() > 0) {

            if (_this.selectionModeNomenclador.getSelected().data.estado == 1) {
                _this.btnAdicionarMConst.enable();

                if (_this.smMConst.getCount() > 0) {

                    if (_this.selectionModeNomenclador.getCount() == 1) {
                        _this.btnModificarMConst.enable();
                    }

                    if (_this.smMConst.getSelected().data.estado == 1) {
                        _this.btnEliminarMConst.enable();
                        _this.btnHabilitarMConst.disable();

                    } else {
                        _this.btnEliminarMConst.disable();
                        _this.btnHabilitarMConst.enable();
                    }
                }
                if (_this.smMConst.getCount() > 1) {
                    _this.btnModificarMConst.disable();
                }
                if (_this.selectionModeNomenclador.selections.items.length > 1) {
                    _this.btnAdicionarMConst.disable();
                    _this.btnEliminarMConst.disable();
                    _this.btnHabilitarMConst.disable();
                    _this.btnModificarMConst.disable();
                }
            }
        }
    },
    activarBotones: function() {

        var _this = this;

        this.btnModificar.disable();
        this.btnEliminar.disable();
        this.btnUsarEntidad.disable();
        this.btnNoUsarEntidad.disable();
        this.btnHabilitar.disable();

        this.btnAdicionarMConst.disable();
        this.btnModificarMConst.disable();
        this.btnEliminarMConst.disable();
        this.btnHabilitarMConst.disable();

        var itemSeleccionado = _this.selectionModeNomenclador.getSelected();
        if (_this.selectionModeNomenclador.getCount() > 0 && itemSeleccionado.id !== 0) {
            if (_this.selectionModeNomenclador.getCount() == 1) {
                if (itemSeleccionado.data.idtipoconstruccion < 0) {
                    this.btnEliminar.disable();
                } else {
                    this.btnModificar.enable();
                }
            }

            if (itemSeleccionado.data.estado == 1) {
                if (itemSeleccionado.data.idtipoconstruccion < 0) {
                    this.btnEliminar.disable();
                } else {
                    this.btnEliminar.enable();
                }


                if (itemSeleccionado.data.usarentidad) {
                    this.btnNoUsarEntidad.enable();
                    this.btnNoUsarEntidad.setVisible(true);
                    this.btnUsarEntidad.setVisible(false);
                } else {
                    this.btnUsarEntidad.enable();
                    this.btnNoUsarEntidad.setVisible(false);
                    this.btnUsarEntidad.setVisible(true);
                }
            } else {
                this.btnHabilitar.enable();
                this.btnEliminar.disable();
            }

            if (_this.selectionModeNomenclador.getCount() > 1) {
                for (var i = 0; i < _this.selectionModeNomenclador.selections.items.length; i++) {
                    if (_this.selectionModeNomenclador.selections.items[i].data.idtipoconstruccion < 0 || _this.selectionModeNomenclador.selections.items[i].data.estado == 0) {
                        this.btnEliminar.disable();
                        break;
                    } else {
                        this.btnEliminar.enable();
                    }
                }
            }

            if (itemSeleccionado.id === 0) {
                this.btnModificar.disable();
                this.btnEliminar.disable();
                this.btnUsarEntidad.disable();
                this.btnNoUsarEntidad.disable();
                this.btnHabilitar.disable();

            }
            else {
                _this.activarBotonesMateriales();
            }
        }

    }
});

