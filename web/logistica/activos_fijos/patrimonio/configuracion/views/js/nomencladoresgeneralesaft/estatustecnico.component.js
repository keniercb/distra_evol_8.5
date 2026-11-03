/**
 *  Yoendy Martinez Contreras
 *  05/08/2013
 */
Ext.ns('Ext.erp.nomestatus');
Ext.erp.nomestatus = new Ext.extend(Ext.erp.gridPanelNomenclador, {
    fpGestionarOper: {},
    constructor: function(config) {
        var _this = this;
        config.campoIdNomenclador = 'idestatustecnico';
        Ext.apply(this, config);

        this.codigo = false;
        this.bussinesModel = 'EstatusModel';
        _this.columnsFields = [
            {
                header: _this.idioma.lbdeprecia,
                width: 55,
                dataIndex: 'deprecia',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }
        ]

        _this.storeFields = [
            {
                name: 'deprecia'
            },
            {
                name: 'idestatustecnico'
            },
            {
                name: 'idpadre'
            },
            {
                name: 'disponible'
            }
        ]

        this.panelEstOperativos = new Ext.Panel({
            height: 40, width: 100,
            items: [
                {
                    xtype: 'checkbox',
                    boxLabel: _this.idioma.lbdeprecia,
                    name: 'deprecia',
                    hideLabel: false,
                    inputValue: 1
                }
            ]
        });
        _this.formFields = [this.panelEstOperativos];
        Ext.erp.nomestatus.superclass.constructor.call(this, arguments);

        this.selectionModeNomenclador.singleSelect = false;
        this.btnAdicionarOperativo = new Ext.Button({
            text: _this.idioma.lbBtnAdicionarEO,
            tooltip: _this.idioma.lbTtBtnAdicionarModelo,
            iconCls: 'adicionar'
        });
        this.btnModificarOperativo = new Ext.Button({
            text: _this.idioma.lbBtnModificarEO,
            tooltip: _this.idioma.lbTtBtnModificarModelo,
            iconCls: 'modificar',
            disabled: true
        });
        this.btnEliminarOperativo = new Ext.Button({
            text: _this.idioma.lbBtnEliminar,
            tooltip: _this.idioma.lbTtBtnEliminarModelo,
            iconCls: 'eliminar',
            disabled: true
        });
        this.btnHabilitarOperativo = new Ext.Button({
            text: _this.idioma.lbBtnHabilitar,
            tooltip: _this.idioma.tipBtnHabilitarET,
            iconCls: 'habilitar',
            disabled: true
        });
        this.btnBuscarOperativos = new Ext.Button({
            text: _this.idioma.lbBtnBuscarEO,
            tooltip: _this.idioma.tipBtnBuscarEO,
            iconCls: 'buscar'
        });
        this.btnLimpiarOperativos = new Ext.Button({
            text: _this.idioma.lbBtnLimpiarEO,
            tooltip: _this.idioma.tipBtnLimpiarEO,
            iconCls: 'limpiar'
        });
        this.tfDenomOperativo = new Ext.form.TextField({
            id: 'tfdenooperativo',
            maxLength: 255,
            maxLengthText: _this.idioma.lbTxtMaxLgth255,
            // regex: /^([\s]?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            // maskRe: /^([\s]?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            regexText: _this.idioma.lbMsgRegexTextOperativo,
            listeners: {
                'valid': function(field) {
                    /*if (field.getValue().charAt(0) == ' ') {
                        field.markInvalid(_this.idioma.lbMsgRegexTextOperativo);
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbMsgRegexTextOperativo);
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbMsgRegexTextOperativo);
                                }
                            }

                        }
                    }
                    */
                }
            }
        });
        this.panelBotonesOperativos = new Ext.Panel({
            tbar: [this.btnAdicionarOperativo, this.btnModificarOperativo, this.btnEliminarOperativo, this.btnHabilitarOperativo],
            border: false,
            region: 'north'
        });
        this.stOperativos = new Ext.data.Store({
            url: _this.urlController + 'cargarnomenclador',
            baseParams: {
                operativo: true,
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: 'idestatustecnico',
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'estado'
                    },
                    {
                        name: 'idestatusoperativo'
                    },
                    {
                        name: 'disponible'
                    },
                    {
                        name: 'idpadre'
                    },
                    {
                        name: 'pordefecto'
                    },
                    {
                        name: 'afectacdt'
                    }
                ]
            })
        });
        this.stOperativos.on({
            'beforeload': function(st) {
                st.baseParams.idpadre = _this.selectionModeNomenclador.getSelected().id;
            },
            'load': function(st, rec) {
                Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarOperativo.disable();
                Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminarOperativo.disable();
                if (rec.length == 0) {
                    if (_this.buscarOP)
                        mostrarMensaje(1, _this.idioma.lbSindatosBuscar);
                    _this.buscarOP = false;
                }
            }
        });
        this.smOperativos = new Ext.grid.RowSelectionModel();
        this.cmOperativos = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'N.\xb0',
                width: 30
            }), {
                header: _this.idioma.lbEstado,
                width: 55,
                dataIndex: 'estado',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmHabiltado + '"';
                    } else {
                        metaData.css = 'inactivo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmDeshabiltado + '"';
                    }
                }
            }, {
                header: _this.idioma.lbDenominacion,
                dataIndex: 'denominacion',
                id: 'expndiroperativos'
            }, {
                header: _this.idioma.lbdisponible,
                width: 80,
                dataIndex: 'disponible',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }, {
                header: _this.idioma.lbpordefecto,
                width: 80,
                dataIndex: 'pordefecto',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }, {
                header: _this.idioma.lbafecta,
                width: 80,
                dataIndex: 'afectacdt',
                align: 'center',
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            }
        ]);
        this.gridPanelOperativos = new Ext.grid.GridPanel({
            region: 'center',
            border: false,
            tbar: ['', new Ext.menu.TextItem({
                    text: _this.idioma.lbDenominacion + ':'
                }), '', this.tfDenomOperativo, '', _this.btnBuscarOperativos, '', this.btnLimpiarOperativos],
            autoExpandColumn: 'expndiroperativos',
            cm: _this.cmOperativos,
            store: _this.stOperativos,
            sm: _this.smOperativos,
            loadMask: {
                store: _this.stOperativos
            },
            bbar: new Ext.PagingToolbar({
                store: _this.stOperativos,
                displayInfo: true,
                pageSize: 5
            })
        });
        this.panelOperativos = new Ext.Panel({
            region: 'south',
            title: _this.idioma.lbestatusoprativo,
            collapsible: true,
            collapsed: true,
            border: false,
            split: true,
            collapseMode: 'mini',
            height: 240,
            layout: 'border',
            items: [this.panelBotonesOperativos, this.gridPanelOperativos]
        });
        this.add(_this.panelOperativos);
        this.selectionModeNomenclador.on({
            'rowselect': function(sm, rowIndex, r) {
                if (sm.selections.items.length > 1) {
                    _this.btnAdicionarOperativo.disable();
                    _this.btnEliminarOperativo.disable();
                    _this.btnHabilitarOperativo.disable();
                    _this.btnModificarOperativo.disable();
                }
                _this.activarBotones();
                _this.stOperativos.load({
                    start: 0,
                    limit: 5
                });
                _this.panelOperativos.expand();
            },
            'rowdeselect': function(sm, rowIndex, r) {
                _this.activarBotones();
                if (sm.selections.items.length == 1) {
                    _this.btnAdicionarOperativo.enable();
                }
            }
        });
        this.smOperativos.on({
            'rowselect': function(sm) {
                _this.activarBotonesOperativos();
                if (sm.getCount() > 1) {
                    _this.btnModificarOperativo.disable();
                }
                //_this.activarBotonesOperativos();
            },
            'rowdeselect': function() {
                _this.activarBotonesOperativos();
            }
        });
        _this.btnAdicionarOperativo.on({
            'click': function() {
                _this.ventanaGestion(false, _this.selectionModeNomenclador.getSelected().id);
            }
        });
        _this.btnEliminarOperativo.on({
            'click': function() {
                if (_this.smOperativos.getCount() > 0) {
                    var idnomencladores = new Array();
                    Ext.each(_this.smOperativos.getSelections(), function(item) {
                        idnomencladores.push(item.get('idestatusoperativo'));
                    });
                    _this.onAceptarEliminar(false, idnomencladores, function() {
                        _this.stOperativos.reload();
                    }, _this.idioma.lbMsgNomencladorEliminadoOP, _this.idioma.lbMsgConfirmarEliminarOP);
                }
            }
        });
        _this.btnHabilitarOperativo.on({
            'click': function() {
                if (_this.smOperativos.getCount() > 0) {
                    var idnomencladores = new Array();
                    Ext.each(_this.smOperativos.getSelections(), function(item) {
                        idnomencladores.push(item.id);
                    });
                    _this.onAceptarActivar(idnomencladores, function() {
                        _this.stOperativos.reload();
                    }, _this.idioma.lbMsgModelodorActivado);
                }
            }
        });
        _this.btnModificarOperativo.on({
            'click': function() {
                if (_this.smOperativos.getSelected()) {
                    _this.ventanaGestion(true);
                } else {
                    mostrarMensaje(1, _this.idioma.lbMsgSeleccionarModificar);
                }
            }
        });
        this.btnEliminar.on({
            'click': function() {
                if (_this.selectionModeNomenclador.getSelected()) {

                    _this.onAceptarEliminar(true, _this.selectionModeNomenclador.getSelected().get('idestatustecnico'), function() {
                        _this.storeNomenclador.reload();
                    });
                }
            }
        });
        this.btnBuscarOperativos.on({
            'click': function() {
                _this.buscarOP = true;
                var objParams = {
                    start: 0
                };
                if (_this.tfDenomOperativo.getValue()) {
                    objParams.denominacion = _this.tfDenomOperativo.getValue();
                }

                _this.stOperativos.reload({
                    params: objParams
                });
            }
        });
        this.btnLimpiarOperativos.on({
            'click': function() {
                _this.buscarOP = false;
                _this.tfDenomOperativo.reset();
                _this.stOperativos.load({
                    params: {
                        start: 0,
                        denominacion: ''
                    }
                });
            }
        });

        document.onkeyup = function(e) {
        };
        var tempHotKeysDocument = [];

        function callkeydownhandler(evnt) {
            var ev = (evnt) ? evnt : event;
            var code = (ev.which) ? ev.which : event.keyCode;
            var adicionar = '18|73|77';
            var modificar = '18|77|79';
            var buscar = '18|66|85';
            var limpiar = '18|76|73';
            var adicionar_status = '18|73';
            if (code == 18) { // Alt
                tempHotKeysDocument = [18];
            } else {
                tempHotKeysDocument.push(code);
                window.setTimeout(function() {
                    switch (tempHotKeysDocument.join('|')) {
                        case '18|73':// adicionar estatus Alt+I
                            tempHotKeysDocument = [];
                            if (_this.btnAdicionar && !Ext.Msg.isVisible() && !_this.verificarWinMsgAuxiliares()) {
                                if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.isVisible()
                                        && Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionar.disabled == false
                                        ) {
                                    Ext.getCmp('tabPanelCentral').getActiveTab().onBtnAdicionarClick();
                                    Ext.getCmp('tabPanelCentral').getActiveTab().activaFuncionBotonesAdd();
                                }
                            }
                            break;

                        case '18|66':// buscar estatus Alt+B
                            tempHotKeysDocument = [];
                            Ext.getCmp('tabPanelCentral').getActiveTab().btnBuscar.fireEvent('click');

                            break;

                        case '18|76':// limpiar estatus Alt+L
                            tempHotKeysDocument = [];
                            Ext.getCmp('tabPanelCentral').getActiveTab().btnLimpiar.fireEvent('click');

                            break;

                        case '18|46':// eliminar operativo Alt+DEL
                            tempHotKeysDocument = [];
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminarOperativo && !Ext.getCmp('idwinGestionarOp')) {
                                if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminarOperativo.isVisible()
                                        && Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminarOperativo.
                                        disabled == false) {
                                    if (Ext.getCmp('tabPanelCentral').getActiveTab().smOperativos.getSelected()) {
                                        if (_this.smOperativos.getSelected()) {
                                            if (_this.smOperativos.getCount() > 0) {
                                                var idnomencladores = new Array();
                                                Ext.each(_this.smOperativos.getSelections(), function(item) {
                                                    idnomencladores.push(item.get('idestatusoperativo'));
                                                });
                                                _this.onAceptarEliminar(false, idnomencladores, function() {
                                                    _this.stOperativos.reload();
                                                }, _this.idioma.lbMsgNomencladorEliminadoOP,
                                                        _this.idioma.lbMsgConfirmarEliminarOP);
                                            }
                                        }
                                    }
                                }
                            }

                            break;

                        case '46':// eliminar estatus DEL
                            tempHotKeysDocument = [];
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar && !Ext.getCmp('idwinGestionarOp') && !_this.verificarWinMsgAuxiliares()) {
                                if (Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.isVisible() &&
                                        Ext.getCmp('tabPanelCentral').getActiveTab().btnEliminar.disabled == false) {
                                    if (Ext.getCmp('tabPanelCentral').getActiveTab().selectionModeNomenclador.
                                            getSelected()) {
                                        if (_this.selectionModeNomenclador.getSelected()) {
                                            _this.onAceptarEliminar(true, _this.selectionModeNomenclador.
                                                    getSelected().get('idestatustecnico'), function() {
                                                _this.storeNomenclador.reload();
                                            });
                                        }
                                    }
                                }
                            }

                            break;

                        case '18|77':// modificar estatus Alt+M
                            tempHotKeysDocument = [];
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar && !Ext.Msg.isVisible()
                                    && !_this.verificarWinMsgAuxiliares()) {
                                if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.isVisible() &&
                                        Ext.getCmp('tabPanelCentral').getActiveTab().btnModificar.disabled == false) {
                                    Ext.getCmp('tabPanelCentral').getActiveTab().onBtnModificarClick(
                                            Ext.getCmp('tabPanelCentral').getActiveTab());
                                }
                            }
                            break;

                        case '18|73|79'://adicionar operativo//  Alt+I+O 
                            tempHotKeysDocument = [];
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarOperativo && !Ext.getCmp('idwinGestionarOp') && !Ext.Msg.isVisible()) {                               
                                if (Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarOperativo.isVisible() &&
                                        Ext.getCmp('tabPanelCentral').getActiveTab().btnAdicionarOperativo.
                                        disabled == false) {
                                    _this.ventanaGestion(false, _this.selectionModeNomenclador.getSelected().id);
                                }
                            }
                            break;
                        case '18|77|79'://Modificar operativo. Alt+M+O
                            tempHotKeysDocument = [];
                            if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarOperativo && !Ext.getCmp('idwinGestionarOp') && !Ext.Msg.isVisible()) {
                                if (Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarOperativo.isVisible() &&
                                        Ext.getCmp('tabPanelCentral').getActiveTab().btnModificarOperativo.
                                        disabled == false) {
                                    if (_this.smOperativos.getSelected()) {
                                        _this.ventanaGestion(true);
                                    } else {
                                        mostrarMensaje(1, _this.idioma.lbMsgSeleccionarModificar);
                                    }
                                }
                            }
                            break;
                        case '18|66|79'://Buscar operativo. Alt+B+O
                            tempHotKeysDocument = [];
                            Ext.getCmp('tabPanelCentral').getActiveTab().btnBuscarOperativos.fireEvent('click');

                            break;
                        case '18|76|73'://Limpiar operativo. Alt+L+I
                            tempHotKeysDocument = [];
                            Ext.getCmp('tabPanelCentral').getActiveTab().btnLimpiarOperativos.fireEvent('click');

                            break;
                        default:
                            tempHotKeysDocument = [];
                            break;
                    }

                }, 750);
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
    activarBotonesOperativos: function() {
        var _this = this;
        Ext.erp.nomestatus.superclass.activarBotones.call(this);
        _this.btnAdicionarOperativo.disable();
        _this.btnEliminarOperativo.disable();
        _this.btnHabilitarOperativo.disable();
        _this.btnModificarOperativo.disable();
        if (_this.selectionModeNomenclador.getCount() > 0) {
            if (_this.selectionModeNomenclador.selections.items.length > 1) {
                _this.btnAdicionarOperativo.disable();
                _this.btnEliminarOperativo.disable();
                _this.btnHabilitarOperativo.disable();
                _this.btnModificarOperativo.disable();

            } else {
                if (_this.selectionModeNomenclador.getSelected().data.estado == 1) {
                    _this.btnAdicionarOperativo.enable();
                    if (_this.smOperativos.getCount() > 0) {
                        if (_this.selectionModeNomenclador.getCount() == 1)
                            this.btnModificarOperativo.enable();
                        if (_this.smOperativos.getSelected().data.estado == 1) {
                            _this.btnEliminarOperativo.enable();
                            _this.btnHabilitarOperativo.disable();
                        }
                        else {
                            _this.btnEliminarOperativo.disable();
                            _this.btnHabilitarOperativo.enable();
                        }
                    }
                }
            }
        }

    },
    /**
     *
     */
    onBtnAdicionarClick: function() {
        var _this = this;
        Ext.erp.nomestatus.superclass.onBtnAdicionarClick.call(this);
    },
    verificarWinMsgAuxiliares: function() {
        var _this = this;
        if (_this.winGestionarOp && _this.winGestionarOp.isVisible())
            return true;
        return false;
    },
    onBtnAceptarClick: function(modificar, _fn, msgerr) {

        var _this = this;
        var msgWait = (modificar == true) ? _this.idioma.lbMsgWaitModificado : _this.idioma.lbMsgWaitAdicionado;
        var url = _this.urlController + ((modificar == false) ? 'insertarnomenclador' : 'modificarnomenclador');
        var tempFp = _this.fpGestionarNomenclador.getForm();
        if (!tempFp.isValid()) {
            mostrarMensaje(3, _this.idioma.lbMsgCamposInvalidos);
            return;
        }

        if (modificar && !tempFp.isDirty()) {
            _this.winGestionarNomenclador.close();
            return;
        }

        tempFp.submit({
            url: url,
            waitMsg: msgWait,
            method: 'POST', params: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel
            },
            success: function(form, action) {
                if (typeof _fn == 'function') {
                    _fn.call();
                }
            },
            failure: function(form, action) {
                if (action.result.etiqueta && action.result.cod == '1') {
                    mostrarMensaje(1, (msgerr) ? msgerr : _this.idioma[action.result.etiqueta]);
                } else if (action.result.etiqueta && action.result.cod == '3') {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                } else
                    (action.result.etiqueta)
                {
                    mostrarMensaje(1, _this.idioma[action.result.etiqueta]);
                }
            }
        });
    },
    onAceptarEliminar: function(tecnico, idnomenclador, _fn, msgp, msgr, msge) {
        var _this = this;
        mostrarMensaje(2, (msgp) ? msgp : _this.idioma.lbMsgConfirmarEliminar, function(btn) {
            if (btn == 'ok') {
                var ldMsgmascara = _this.idioma.lbMsgEliminandoNomenclador;
                if (!tecnico) {
                    ldMsgmascara = _this.idioma.lbMsgEliminandoNomencladorOperativo;
                }
                Ext.getBody().mask(ldMsgmascara);
                Ext.Ajax.request({
                    url: _this.urlController + 'eliminarnomenclador',
                    params: {
                        idpadre: _this.selectionModeNomenclador.getSelected().id,
                        idnom: Ext.encode(idnomenclador),
                        pkid: (tecnico) ? _this.campoIdNomenclador : 'idestatusoperativo',
                        modelo: (tecnico) ? _this.modelo : 'NomEstatusoperativo'
                    },
                    method: 'POST',
                    callback: function(o, s, r) {
                        var dataResp = Ext.decode(r.responseText);
                        Ext.getBody().unmask();
                        if (dataResp.cod == 1) {
                            mostrarMensaje(1, (msgr) ? msgr : _this.idioma.lbMsgNomencladorEliminado);
                            if (typeof _fn == 'function') {
                                _fn.call();
                            }
                        } else {
                            mostrarMensaje(3, (msge) ? msge : _this.idioma.lbMsgErrorEliminado);
                        }
                    }
                });
            }
        });
    },
    ventanaGestion: function(modificar, idpadre) {

        var _this = this;
        var msgWait = (modificar) ? _this.idioma.lbMsgWaitModificadoOP : _this.idioma.lbMsgWaitAdicionadoOP;

        function AddMod(cierra) {
            if (modificar && !_this.fpGestionarOper.getForm().isDirty()) {
                _this.winGestionarOp.close();
                return;
            }
            if (_this.fpGestionarOper.getForm().isValid()) {
                _this.fpGestionarOper.getForm().submit({
                    url: _this.urlController + ((modificar == false) ? 'insertarEstatusOperativo' : 'modificarEstatusOperativo'),
                    waitMsg: msgWait,
                    method: 'POST', params: {
                        modelo: 'NomEstatustecnico',
                        idnom: _this.campoIdNomenclador,
                        bussines: _this.bussinesModel,
                        idestatusoperativo: (modificar) ? _this.smOperativos.getSelected().data.idestatusoperativo : "",
                        idpadre: _this.selectionModeNomenclador.getSelected().id
                    },
                    success: function(form, action) {
                        _this.stOperativos.reload();
                        mostrarMensaje(1, ((modificar == false) ? _this.idioma.lbMsgModeloAdicionado : _this.idioma.lbMsgModeloModificado));
                        _this.fpGestionarOper.getForm().reset();
                        _this.stOperativos.reload();
                        if (cierra)
                            _this.winGestionarOp.close();
                    },
                    failure: function(form, action) {
                        if (action.result && action.result.etiqueta) {
                            if (action.result.etiqueta == 'msjAddDescexist')
                                mostrarMensaje(1, _this.idioma.msjAddOPDescexist);
                            else if (action.result.etiqueta == 'msjModDescexist')
                                mostrarMensaje(1, _this.idioma.msjModOPCodDescexist);
                            _this.fpGestionarOper.getForm().reset();
                        } else {
                            var idestatusoperativodup = action.result.idestatusoperativodup;
                            mostrarMensaje(2, _this.idioma.msjDuplEstatusOperativo, function(opcion) {
                                if (opcion == 'ok') {
                                    _this.duplicarEstatusOperativo(idestatusoperativodup, function(form, action) {

                                        mostrarMensaje(1, ((modificar == false) ? _this.idioma.lbMsgModeloAdicionado : _this.idioma.lbMsgModeloModificado));
                                        if (cierra)
                                            _this.winGestionarOp.close();
                                        _this.fpGestionarOper.getForm().reset();
                                        _this.stOperativos.reload();
                                    }, function(form, action) {
                                        if (action.result.etiqueta == 'msjAddDescexist')
                                            mostrarMensaje(1, _this.idioma.msjAddOPDescexist);
                                        else if (action.result.etiqueta == 'msjModDescexist')
                                            mostrarMensaje(1, _this.idioma.msjModOPCodDescexist);
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                mostrarMensaje(1, _this.idioma.msjDatosIncorrectos);
            }
        }

        var paneloperativo = new Ext.Panel({
            height: 40, width: 310,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.3,
                            xtype: 'checkbox',
                            boxLabel: _this.idioma.lbdisponible,
                            name: 'disponible',
                            id: 'idcheckboxdisponible',
                            hideLabel: false,
                            inputValue: 1

                        },
                        {
                            columnWidth: 0.3,
                            xtype: 'checkbox',
                            boxLabel: _this.idioma.lbpordefecto,
                            name: 'pordefecto',
                            id: 'idcheckboxpordefect',
                            hideLabel: false,
                            inputValue: 1
                        },
                        {
                            columnWidth: 0.3,
                            xtype: 'checkbox',
                            boxLabel: _this.idioma.lbafecta,
                            name: 'afectacdt',
                            id: 'idcheckboxafecta',
                            hideLabel: false,
                            inputValue: 1
                        }

                    ]
                }
            ]
        });
        var sm = _this.smOperativos.getSelected();
        var textarea = new Ext.form.TextArea({
            name: 'denominacion',
            anchor: '98%',
            id: 'iddenominacion',
            maxLength: _this.idioma.lbMaxLengthDescripcion,
            maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
            minLength: _this.idioma.lbMinLengthDescripcion,
            minLengthText: _this.idioma.lbMsgMinLongDescripcion,
            regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+([-_/.\s]{0,1}[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)+$/,
            fieldLabel: _this.idioma.lbDenominacion,
            regexText: _this.idioma.lbMsgRegexTextOperativo,
            allowBlank: false,
            listeners: {
                'render': function(field) {
                    field.focus(false, 1000);
                }
            }
        });
        _this.fpGestionarOper = new Ext.form.FormPanel({
            labelAlign: 'top',
            frame: true,
            width: 300,
            autoHeight: true,
            trackResetOnLoad: true,
            items: [textarea, paneloperativo]
        });
        var btnAceptarOp = new Ext.Button({
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptar,
            iconCls: 'aceptar',
            handler: function() {
                AddMod(true);
                _this.keymap.disable();
            },
           /* listeners: {
                'click': function() {
                    AddMod(true);
                }
            }*/
        });
        var btnAplicarOp = new Ext.Button({
            text: _this.idioma.lbBtnAplicar,
            tooltip: _this.idioma.lbTtBtnAplicar,
            iconCls: 'aplicar',
            hidden: modificar,
            handler: function() {
                AddMod(false);
            }
            /* listeners: {
             'click': function() {
             AddMod(false);
             }
             }*/
        });

        var btnCancelarOp = new Ext.Button({
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            iconCls: 'cancelar',
            handler: function() {
                _this.winGestionarOp.close();
                _this.keymap.disable();
            }
        });
        _this.winGestionarOp = new Ext.Window({
            items: [_this.fpGestionarOper],
            closeAction: 'close',
            title: (modificar) ? _this.idioma.lbTitleWinModificarModelo : _this.idioma.lbTitleWinAdicionarOperativo,
            modal: true,
            resizable: false,
            // autoValidate: true,
            validateDefault: true,
            constrain: true,
            forceLayout: true,
            autoHeight: true,
            autoWidth: true,
            id: 'idwinGestionarOp',
            buttons: [btnCancelarOp, btnAplicarOp, btnAceptarOp]
        });

        _this.winGestionarOp.show();
        if (modificar) {
            _this.fpGestionarOper.getForm().loadRecord(_this.smOperativos.getSelected());
        }
        _this.keymap = new Ext.KeyMap(document, [
            {key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (btnCancelarOp.enable()) {
                        btnCancelarOp.handler();
                    }
                }
            },
            {key: 80,
                ctrl: true,
                alt: true,
                stopEvent: true,
                fn: function()
                {  
                    if (!modificar) {
                        if (btnAplicarOp && btnAplicarOp.enable()) {
                            btnAplicarOp.handler();
                        }
                    }
                }
            },
            {   key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                { 
                    if (btnAceptarOp && btnAceptarOp.enable()) {
                        btnAceptarOp.handler();
                    }
                }
            }

        ]);
        _this.keymap.stopEvent = true;
        _this.keymap.enable();


    },
    duplicarEstatusOperativo: function(idestatusoperativodup, _success, _failure) {

        var _this = this;
        _this.fpGestionarOper.getForm().submit({
            url: _this.urlController + 'insertarEstatusOperativo',
            waitMsg: _this.idioma.lbMsgWaitAdicionadoOP,
            method: 'POST', params: {
                duplicar: true,
                idestatusoperativodup: idestatusoperativodup,
                idpadre: _this.selectionModeNomenclador.getSelected().id,
            },
            success: function(form, action) {
                _success(form, action);
            },
            failure: function(form, action) {
                _failure(form, action);
            }
        });
    }
});
