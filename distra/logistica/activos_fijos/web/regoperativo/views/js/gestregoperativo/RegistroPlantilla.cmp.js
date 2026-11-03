Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.Registro_Plantilla = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        _this.idioma = config.idioma;
        _this.resizable = false;
        _this.constrain = true;
        _this.datosPlantilla = null;
        _this.modal = true;
        _this.listeners = {
            'show': function() {
                _this.winListado();
                _this.keymap.stopEvent = true;
                _this.keymap.enable();
            },
            'close': function() {
                this.keymap.disable();
            }
        };

        _this.btnCancelarWinPlantilla = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.btnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function() {
                _this.close();
            }
        });
        _this.btnAceptarWinPlantilla = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.btnAceptar,
            tooltip: _this.idioma.btnTAceptar,
            handler: function() {
                _this.registrodesdePlantilla();
            }
        });
        _this.buttons = [_this.btnCancelarWinPlantilla, _this.btnAceptarWinPlantilla];
        this.stPlanilla = new Ext.data.SimpleStore({
            fields: ['idregnumerico', 'denominacionplantilla'],
            data: [],
            autoLoad: false
        });

        _this.comboPlantilla = new Ext.form.ComboBox({
            width: 130,
            fieldLabel: _this.idioma.lbcombPlantilla,
            valueField: 'denominacionplantilla',
            displayField: 'denominacionplantilla',
            triggerAction: 'all',
            minChars: 0,
            name: 'denominacionplantilla',
            store: _this.stPlanilla,
            editable: false,
            resizable: true,
            allowBlank: false,
            forceSelection: true,
            mode: 'local',
            listeners: {
                'focus': function() {
                    _this.winListado();
                }
            }
        });
        _this.textfieldRegistro = new Ext.form.NumberField({
            fieldLabel: _this.idioma.lbRegistro,
            name: 'cantidad',
            minValue: 1,
            width: 130,
            maxValue: 100,
            regexText: _this.idioma.lbInvalidText,
            regex: /^[0-9]+$/,
            regexp: /^[0-9]+$/,
            allowBlank: false
        });
        _this.formPlantilla = new Ext.form.FormPanel({
            frame: true,
            items: [_this.comboPlantilla, _this.textfieldRegistro]
        });

        _this.keymap = new Ext.KeyMap(document, [{
                key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this) {
                        _this.btnAceptarWinPlantilla.handler();
                    }
                }
            }, {
                key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this) {
                        _this.btnCancelarWinPlantilla.handler();
                    }
                }
            }]);

        _this.items = [_this.formPlantilla];

        Ext.LOG.RegNumOperativo.Registro_Plantilla.superclass.constructor.apply(this, arguments);
    },
    winListado: function() {
        var _this = this;
        if (!_this.listado_plantilla) {
            _this.listado_plantilla = new Ext.LOG.RegNumOperativo.Listado_Medios({
                title: _this.idioma.lbtitlePlantillas,
                idioma: _this.idioma,
                treegridPrincipal: _this.treegrid,
                notab: 1,
                plantilla: true,
                modal: true,
                functionBtnAceptar: function() {
                    this.fnAceptarPlantilla();
                },
                fn: function(datosPlantilla) {
                    _this.datosPlantilla = datosPlantilla;
                    _this.comboPlantilla.setValue(_this.datosPlantilla.denominacionplantilla);
                }
            });
            _this.listado_plantilla.show();
        } else {
            if (_this.listado_plantilla && !_this.listado_plantilla.isVisible()) {
                _this.listado_plantilla.show();
            }
        }
    },
    registrodesdePlantilla: function() {
        var _this = this;
        if (_this.formPlantilla.getForm().isValid()) {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Adicionando..."});
            myMask.show();
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/clonar',
                method: 'POST',
                params: {
                    idregnumerico: _this.datosPlantilla.idregnumerico,
                    cantidad: _this.textfieldRegistro.getValue(),
                    color:2
                },
                callback: function(options, success, response) {
                    response = Ext.util.JSON.decode(response.responseText);
                    myMask.hide();
                    if (response.codigoMsg == 3) {
                        mostrarMensaje(response.Msg, _this.idioma.MsgAdicionarModuloError);
                        _this.close();
                    } else {
                        _this.close();
                        mostrarMensaje(1, _this.idioma.MsgAdicionarModuloOK);
                        _this.treegrid.getSelectionModel().clearSelections();
                        _this.treegrid.getStore().baseParams = {};
                        _this.treegrid.getStore().load({
                            params: {
                                anode: null,
                                _id: null
                            }
                        });
                    }
                }
            });
        } else {
            mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
        }
    }
});

