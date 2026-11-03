/**
 *  @author Jorge Luis Cuellar Mondeja, Kenier Cumba Bueno
 *  24/07/2013
 */
Ext.ns('Ext.erp.viaadquisicion');

Ext.erp.viaadquisicion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {
        var _this = this;
        config.campoIdNomenclador = 'idviaadquisicion';
        Ext.apply(this, config);
        this.codigo = false;
        this.bussinesModel = 'NomencladoresGeneralesModel';
        Ext.erp.viaadquisicion.superclass.constructor.call(this, arguments);
        _this.storeNomenclador.on({
            'load': function (st, rec) {
                _this.activarBotones();
            }
        });

        this.btnAdicionarModelo = new Ext.Button({
            text: _this.idioma.lbBtnAdicionar,
            tooltip: _this.idioma.lbTtBtnAdicionarModelo,
            iconCls: 'adicionar',
            disabled: true
        });

        this.btnModificarModelo = new Ext.Button({
            text: _this.idioma.lbBtnModificar,
            tooltip: _this.idioma.lbTtBtnModificarModelo,
            iconCls: 'modificar',
            disabled: true
        });

        this.btnEliminarModelo = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminarModelo,
            iconCls: 'eliminar',
            disabled: true
        });

        this.btnHabilitarModelo = new Ext.Button({
            text: _this.idioma.lbBtnHabilitar,
            tooltip: _this.idioma.tipBtnHabilitar,
            iconCls: 'habilitar',
            disabled: true
        });

        this.btnBuscarModelos = new Ext.Button({
            text: _this.idioma.lbBtnBuscar,
            tooltip: _this.idioma.tipBtnBuscarModelo,
            iconCls: 'buscar'
        });

        this.btnLimpiarModelos = new Ext.Button({
            text: _this.idioma.lbBtnLimpiar,
            tooltip: _this.idioma.tipBtnLimpiarModelo,
            iconCls: 'limpiar'
        });

        this.tfDenomModelo = new Ext.form.TextField({
            id: 'tfdenommodelo',
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

        this.panelBotonesModelos = new Ext.Panel({
            tbar: [this.btnAdicionarModelo, this.btnModificarModelo, this.btnEliminarModelo, this.btnHabilitarModelo],
            border: false,
            region: 'north'
        });

        this.stModelos = new Ext.data.Store({
            url: '/configuracion/nomgenerales/index.php/viaadquisicion/cargarnomenclador',
            baseParams: {
                modelos: true,
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel

            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idviaadquisicion',
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: 'idviaadquisicion'
                    }
                ]
            })
        });

        this.stModelos.on({
            'beforeload': function (st) {
                st.baseParams.idpadre = (_this.selectionModeNomenclador.getSelected()) ? _this.selectionModeNomenclador.getSelected().id : - 1;
            },
            'load': function (st, rec) {
                if (rec.length > 0) {
                    _this.smModelos.selectFirstRow();
                } else {
                    if (_this.buscarModelos) {
                        mostrarMensaje(1, _this.idioma.lbMsgNoModelos);
                        _this.buscarModelos = false;
                    } else
                        mostrarMensaje(1, _this.idioma.lbMsgNoModelosAsociados);
                }
            }
        });

        this.selectionModeNomenclador.on({
            'rowselect': function () {
                _this.activarBotones();
            },
            'rowdeselect': function () {
                _this.activarBotones();
            }
        });

        _this.btnAdicionarModelo.on({
            'click': function () {
                _this.onBtnAdicionarClick();
                _this.fpGestionarNomenclador.getForm().on({
                    'beforeaction': function (fp, action) {
                        _this.fpGestionarNomenclador.getForm().baseParams = {
                            idpadre: _this.selectionModeNomenclador.getSelected() ? _this.selectionModeNomenclador.getSelected().id : null
                        };
                    }
                });
                _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionarModelo);
                _this.btnAceptar.on({
                    'click': function () {
//                        if (/*Ext.getCmp('iddeno').isValid()&& */_this.campovalido){
                        _this.onBtnAceptarClick(false, function () {
                            mostrarMensaje(1, _this.idioma.lbMsgModeloAdicionado);
                            _this.stModelos.reload();
                            _this.winGestionarNomenclador.close();
                        }, false, 'NomViaadquisicion');
//                    }
//                else{
//                     mostrarMensaje(1, _this.idioma.lbMsgCamposInvalidos);
//                }
            }
                });

                _this.btnAplicar.on({
                    'click': function() {
//                        if (/*Ext.getCmp('iddeno').isValid() && */_this.campovalido) {
                            _this.onBtnAceptarClick(false, function() {
                                mostrarMensaje(1, _this.idioma.lbMsgModeloAdicionado);
                                _this.stModelos.reload();
                                _this.fpGestionarNomenclador.getForm().reset();
                            }, false, 'NomViaadquisicion');
//                        } else {
//                            mostrarMensaje(1, _this.idioma.lbMsgCamposInvalidos);
//                        }
                    }
                });
            }
        });

        _this.btnEliminarModelo.on({
            'click': function () {
                if (_this.smModelos.getCount() > 0) {
                    var idnomencladores = new Array();
                    Ext.each(_this.smModelos.getSelections(), function (item) {
                        idnomencladores.push(item.id);
                    });
                    _this.onAceptarEliminar(idnomencladores, function () {
                        _this.stModelos.reload();
                    }, _this.idioma.lbMsgConfirmarEliminarModelo, _this.idioma.lbMsgModeloEliminado, _this.idioma.lbMsgErrorEliminadoModelo, 'NomModelo');
                }
            }
        });

        _this.btnHabilitarModelo.on({
            'click': function () {
                if (_this.smModelos.getCount() > 0) {
                    var idnomencladores = new Array();
                    Ext.each(_this.smModelos.getSelections(), function (item) {
                        idnomencladores.push(item.id);
                    });
                    _this.onAceptarActivar(idnomencladores, function () {
                        _this.stModelos.reload();
                    }, _this.idioma.lbMsgModeloActivado, 'NomViaadquisicion');
                }
            }
        });

        _this.btnModificarModelo.on({
            'click': function() {
                if (_this.smModelos.getSelected()) {

                    _this.onBtnAdicionarClick();
                    _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificarModelo);
                    _this.fpGestionarNomenclador.getForm().loadRecord(_this.smModelos.getSelected());

                    _this.btnAceptar.on({
                        'click': function() {
//                            if (/*Ext.getCmp('iddeno').isValid() && */_this.campovalido) {
                                _this.onBtnAceptarClick(true, function() {
                                    mostrarMensaje(1, _this.idioma.lbMsgModeloModificado);
                                    _this.stModelos.reload();
                                    _this.winGestionarNomenclador.close();
                                }, false, 'NomViaadquisicion');
//                            }
//                            else {
//                                mostrarMensaje(1, _this.idioma.lbMsgCamposInvalidos);
//                            }
                        }
                    });
                    _this.btnAplicar.setVisible(false);
                } else {
                    mostrarMensaje(1, _this.idioma.lbMsgSeleccionarModificar);
                }
            }
        });

        this.btnBuscarModelos.on({
            'click': function () {
                _this.buscarModelos = true;
                var objParams = {
                    start: 0
                };
                if (_this.tfDenomModelo.getValue()) {
                    objParams.denominacion = _this.tfDenomModelo.getValue();
                }

                _this.stModelos.reload({
                    params: objParams
                });
            }
        });

        this.btnLimpiarModelos.on({
            'click': function () {
                _this.buscarModelos = false;
                _this.tfDenomModelo.reset();
                _this.stModelos.load({
                    params: {
                        start: 0,
                        denominacion: ''
                    }
                });
            }
        });

        /**
         * Teclas calientes
         */
        document.onkeyup = function (e) {
            if (! _this.winGestionarNomenclador || ! _this.winGestionarNomenclador.isVisible()) {
                
                if (e.altKey) {
                    if (e.which == Ext.EventObject.M) {
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar && !Ext.Msg.isVisible()) {
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.disabled == false) {
                                Ext.getCmp('tabPanelCentral').getActiveTab().onBtnModificarClick(Ext.getCmp('tabPanelCentral').getActiveTab());
                            }  
                        }
                    } else if (e.which == Ext.EventObject.H) {
                        var referencia = Ext.getCmp('tabPanelCentral').getActiveTab().idioma.referenciaAyuda;
                        var titulo = Ext.getCmp('tabPanelCentral').getActiveTab().idioma.titleAyuda;
                        help.show(titulo, referencia);
                    } else if (e.which == Ext.EventObject.B && !Ext.Msg.isVisible()) {
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnBuscar.fireEvent('click');
                    }
                
                    else if (e.which == Ext.EventObject.DELETE) {
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminarModelo.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminarModelo.disabled == false) {
                            if (_this.smModelos.getCount() > 0) {
                                var idnomencladores = new Array();
                                Ext.each(_this.smModelos.getSelections(), function (item) {
                                    idnomencladores.push(item.id);
                                });
                                _this.onAceptarEliminar(idnomencladores, function () {
                                    _this.stModelos.reload();
                                }, _this.idioma.lbMsgConfirmarEliminarModelo, _this.idioma.lbMsgModeloEliminado, _this.idioma.lbMsgErrorEliminadoModelo);
                            }
                        }
                    }
                    
                    else if (e.which == Ext.EventObject.L && !Ext.Msg.isVisible()) {
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnLimpiar.fireEvent('click');
                    }
                }
              
              
                if (e.ctrlKey) {
                    if (e.which == Ext.EventObject.I && !Ext.Msg.isVisible()) {                        
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarModelo.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarModelo.disabled == false) {

                            _this.onBtnAdicionarClick();

                            _this.fpGestionarNomenclador.getForm().on({
                                'beforeaction': function (fp, action) {
                                    _this.fpGestionarNomenclador.getForm().baseParams = {
                                        idpadre: _this.selectionModeNomenclador.getSelected() ? _this.selectionModeNomenclador.getSelected().id : null
                                    };
                                }
                            });

                            _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionarModelo);
                            _this.btnAceptar.on({
                                'click': function () {                                    
                                    _this.onBtnAceptarClick(false, function () {                                        
                                        mostrarMensaje(1, _this.idioma.lbMsgModeloAdicionado);
                                        _this.stModelos.reload();
                                        _this.winGestionarNomenclador.close();
                                    }, false, 'NomModelos');
                                }
                            });

                            _this.btnAplicar.on({
                                'click': function () {
                                    _this.onBtnAceptarClick(false, function () {
                                        mostrarMensaje(1, _this.idioma.lbMsgModeloAdicionado);
                                        _this.stModelos.reload();
                                        _this.fpGestionarNomenclador.getForm().reset();
                                    }, false, 'NomModelos');
                                }
                            });
                        }                        
                    }

                    else if (e.which == Ext.EventObject.M && !Ext.Msg.isVisible()) {                                 
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarModelo.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarModelo.disabled == false) {

                            if (_this.smModelos.getSelected()) {

                                _this.onBtnAdicionarClick();
                                _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificarModelo);
                                _this.fpGestionarNomenclador.getForm().loadRecord(_this.smModelos.getSelected());

                                _this.btnAceptar.on({
                                    'click': function () {
                                        _this.onBtnAceptarClick(true, function () {
                                            mostrarMensaje(1, _this.idioma.lbMsgModeloModificado);
                                            _this.stModelos.reload();
                                            _this.winGestionarNomenclador.close();
                                        }, false, 'NomViaadquisicion');
                                    }
                                });
                                _this.btnAplicar.setVisible(false);
                            }                        
                        }
                    } else if (e.which == Ext.EventObject.B && !Ext.Msg.isVisible()) {                                  
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnBuscarModelos.fireEvent('click');                    
                    } else if (e.which == Ext.EventObject.L && !Ext.Msg.isVisible()) {                        
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnLimpiarModelos.fireEvent('click');                    
                    }

                }

                if (e.which == Ext.EventObject.DELETE && ! e.altKey) {                    
                    if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar) {
                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.disabled == false) {
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().selectionModeNomenclador.getSelected()) {
                                var idnomencladores = new Array();
                                Ext.each(Ext.getCmp('tabPanelCentral').getActiveTab().selectionModeNomenclador.getSelections(), function (item) {
                                    idnomencladores.push(item.id);
                                });
                                Ext.getCmp('tabPanelCentral').getActiveTab().onAceptarEliminar(idnomencladores, function () {
                                    Ext.getCmp('tabPanelCentral').getActiveTab().storeNomenclador.reload();
                                });
                            }
                        }
                    }
                }         
            }
        };
        
        var tempHotKeysDocument = [];
        function callkeydownhandler(evnt) {
            var ev = (evnt) ? evnt : event;
            var code = (ev.which) ? ev.which : event.keyCode;

            var adicionar = '18|73|77';
            var modificar = '18|77|79';
            var buscar = '18|66|85';
            var limpiar = '18|76|73';
            var adicionar_marca = '18|73';

            if (code == 18) { // Alt
                tempHotKeysDocument = [18];
            } else {
                tempHotKeysDocument.push(code);
                if (tempHotKeysDocument.length == 3) {
                    if (tempHotKeysDocument.join('|') == adicionar && !Ext.Msg.isVisible()) {

                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarModelo.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarModelo.disabled == false) {

                            _this.onBtnAdicionarClick();

                            _this.fpGestionarNomenclador.getForm().on({
                                'beforeaction': function(fp, action) {
                                    _this.fpGestionarNomenclador.getForm().baseParams = {
                                        idpadre: _this.selectionModeNomenclador.getSelected() ? _this.selectionModeNomenclador.getSelected().id : null
                                    };
                                }
                            });

                            _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinAdicionarModelo);
                            _this.btnAceptar.on({
                                'click': function() {
                                    _this.onBtnAceptarClick(false, function() {
                                        mostrarMensaje(1, _this.idioma.lbMsgModeloAdicionado);
                                        _this.stModelos.reload();
                                        _this.winGestionarNomenclador.close();
                                    }, false, 'NomModelos');
                                }
                            });

                            _this.btnAplicar.on({
                                'click': function() {
                                    _this.onBtnAceptarClick(false, function() {
                                        mostrarMensaje(1, _this.idioma.lbMsgModeloAdicionado);
                                        _this.stModelos.reload();
                                        _this.fpGestionarNomenclador.getForm().reset();
                                    }, false, 'NomModelos');
                                }
                            });
                        }
                    }

                    if (tempHotKeysDocument.join('|') == modificar && !Ext.Msg.isVisible()) {

                        if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarModelo.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarModelo.disabled == false) {

                            if (_this.smModelos.getSelected()) {

                                _this.onBtnAdicionarClick();
                                _this.winGestionarNomenclador.setTitle(_this.idioma.lbTitleWinModificarModelo);
                                _this.fpGestionarNomenclador.getForm().loadRecord(_this.smModelos.getSelected());

                                _this.btnAceptar.on({
                                    'click': function() {
                                        _this.onBtnAceptarClick(true, function() {
                                            mostrarMensaje(1, _this.idioma.lbMsgModeloModificado);
                                            _this.stModelos.reload();
                                            _this.winGestionarNomenclador.close();
                                        }, false, 'NomViaadquisicion');
                                    }
                                });
                                _this.btnAplicar.setVisible(false);
                            }
                        }
                    }

                    if (tempHotKeysDocument.join('|') == buscar && !Ext.Msg.isVisible()) {
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnBuscarModelos.fireEvent('click');
                    }

                    if (tempHotKeysDocument.join('|') == limpiar && !Ext.Msg.isVisible()) {
                        Ext.getCmp('tabPanelCentral').getActiveTab().btnLimpiarModelos.fireEvent('click');
                    }
                }
                if (tempHotKeysDocument.length == 2) {
                    if (tempHotKeysDocument.join('|') == adicionar_marca && !Ext.Msg.isVisible()) {
                        if (_this.btnAdicionar && !Ext.Msg.isVisible()) {

                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.isVisible() && Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.disabled == false) {
                                Ext.getCmp('tabPanelCentral').getActiveTab().onBtnAdicionarClick('NomViaadquisicion');
                                Ext.getCmp('tabPanelCentral').getActiveTab().activaFuncionBotonesAdd();
                            }
                        }
                    }
                }
            }
        }
        if (window.document.addEventListener) {
            window.document.addEventListener("keydown", callkeydownhandler, false);
        } else {
            window.document.attachEvent("onkeydown", callkeydownhandler);
        }
    },
    /**
     *
     */
    onBtnAdicionarClick: function () {
        Ext.erp.viaadquisicion.superclass.onBtnAdicionarClick.call(this);
    },
    /**
     *  Redefiniendo la función padre
     */
    onBtnAceptarClick: function (modificar, _fn, msgerr, model) {
        var _this = this;

        var msgWait = (modificar == true) ? ((model == 'NomViaadquisicion') ? _this.idioma.lbMsgWaitModificadoModelo : _this.idioma.lbMsgWaitModificado) : ((model == 'NomViaadquisicion') ? _this.idioma.lbMsgWaitAdicionadoModelo : _this.idioma.lbMsgWaitAdicionado);
        var url = _this.urlController + ((modificar == false) ? 'insertarnomenclador' : 'modificarnomenclador');
        var tempFp = _this.fpGestionarNomenclador.getForm();

        if (! tempFp.isValid()) {
            mostrarMensaje(1, _this.idioma.lbMsgCamposInvalidos);
            return;
        }

        if (modificar && ! tempFp.isDirty()) {
            _this.winGestionarNomenclador.close();
            return;
        }

        if (_this.gridPanelNomenclador.getSelectionModel().getSelected()) {
            idmarca2 = _this.gridPanelNomenclador.getSelectionModel().getSelected().get(_this.campoIdNomenclador);
        }

        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST',
            params: {
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel,
                modelo: (model) ? model : 'NomViaadquisicion'/*,
                idmodelo: idmodelo,
                idmarca2: idmarca2*/
            },
            success: function (form, action) {
                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function (form, action) {
                if (action.result.etiqueta && action.result.cod == '0') {
                    mostrarMensaje(1, (msgerr) ? msgerr : _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '2') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '1') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '1' && action.result.modificar == 'true') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '2' && action.result.modificar == 'true') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                } else {
                    if (modificar) {
                        mostrarMensaje(2, _this.idioma.msjAddCodDescexist);
                    }
                }
            }
        });
    },
    /**
     *
     */
    onAceptarEliminar: function (idnomencladores, _fn, msgp, msgr, msge, modelo) {//msgp, msge y msgr se utiliza en casos como marca modelo
        var _this = this;        
        mostrarMensaje(2, (msgp) ? msgp : _this.idioma.lbMsgConfirmarEliminar, function (btn) {
            if (btn == 'ok') {
                 var lbMsgMascara = 'Eliminando modelo de producto';
                if(!modelo){
                    lbMsgMascara = _this.idioma.lbMsgEliminandoNomenclador;
                }
                Ext.getBody().mask(lbMsgMascara);
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarnomenclador',
                    params: {
                        idnom: Ext.encode(idnomencladores),
                        pkid: (modelo) ? 'idmodelo' : 'idviaadquisicion',
                        modelo: (modelo) ? modelo : 'NomViaadquisicion',//...
                        idviaadquisicion: _this.gridPanelNomenclador.getSelectionModel().getSelected().get('idviaadquisicion')
                    },
                    method: 'POST', callback: function (o, s, r) {
                        var dataResp = Ext.decode(r.responseText);
                        Ext.getBody().unmask();
                        if (dataResp.CodMsg == 1) {
                            mostrarMensaje(1, (msgr) ? msgr : _this.idioma.lbMsgNomencladorEliminado);
                        } else if (dataResp.CodMsg == 3){
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
    onAceptarActivar: function (idnomencladores, _fn, msg, modelo) {
        var _this = this;
        var msgOk = (msg) ? msg : _this.idioma.lbMsgNomencladorActivado;
        Ext.getBody().mask(_this.idioma.lbMsgActivandoNomenclador);
        Ext.Ajax.request({
            url: 'activarnomenclador',
            params: {
                idnom: idnomencladores.join(','),
                pkid: (modelo) ? 'idmodelo' : 'idviaadquisicion',
                modelo: (modelo) ? modelo : 'NomViaadquisicion'
            },
            method: 'POST',
            callback: function (o, s, r) {
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
    },
    activarBotones: function () {
        var _this = this;

        this.btnModificar.disable();
        this.btnEliminar.disable();
        this.btnUsarEntidad.disable();
        this.btnNoUsarEntidad.disable();
        this.btnHabilitar.disable();

        _this.btnAdicionarModelo.disable();
        _this.btnEliminarModelo.disable();
        _this.btnHabilitarModelo.disable();
        _this.btnModificarModelo.disable();

        var itemSeleccionado = _this.selectionModeNomenclador.getSelected();

        if (_this.selectionModeNomenclador.getCount() > 0 && itemSeleccionado.id > 0) {
            _this.btnAdicionarModelo.enable();

            if (_this.selectionModeNomenclador.getCount() == 1) {
                this.btnModificar.enable();
            }

            if (itemSeleccionado.data.estado == 1) {
                this.btnEliminar.enable();

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
            }

            if (itemSeleccionado.id <= 0) {
                this.btnModificar.disable();
                this.btnEliminar.disable();
                this.btnUsarEntidad.disable();
                this.btnNoUsarEntidad.disable();
                this.btnHabilitar.disable();

            } else {
                _this.activarBotonesModelos();
            }
        }
    },
    /**
     *
     */
    activarBotonesModelos: function () {
        var _this = this;

        if (_this.selectionModeNomenclador.getCount() > 0) {
            if (_this.selectionModeNomenclador.getSelected().data.estado == 1) {
                _this.btnAdicionarModelo.enable();

                if (_this.selectionModeNomenclador.getCount() == 1) {
                    _this.btnModificarModelo.enable();
                }
            }
        }
    }
});