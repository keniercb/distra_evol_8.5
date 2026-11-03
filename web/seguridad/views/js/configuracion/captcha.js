Ext.ns("Configuracion");

var captcha = "";
var active = false;
Configuracion.Captcha = Ext.extend(Ext.Panel,
        {
            id: 'Captcha',
            layout: 'fit',
            initComponent: function() {

                var _this = this;
                this.guardarCaptcha = new Ext.Button({
                    id: 'guardarCaptcha',
                    tooltip: perfil.etiquetas.textToolTipGuardar,
                    iconCls: 'guardar',
                    text: 'Guardar',
                    handler: function() {
                        SalvarConfiguracionCaptcha();
                    }

                });
                this.actualizar = new Ext.Button({
                    id: 'actualizarCaptcha',
                    tooltip: perfil.etiquetas.tooltipActualizar,
                    iconCls: 'actualizar',
                    hidden:true,
                    style: {
                        marginBottom: '3.5px',
                        marginTop: '3.5px',
                        marginLeft: '33%',
                    },
                    text: perfil.etiquetas.lbBotonActualizar,
                    handler: function() {
                        if (_this.CaptchaPanel.getForm().isValid()) {
                            _this.CaptchaPanel.getForm().submit({
                                url: arbolAcc.root.childNodes[7].attributes.controller + 'generate',
                                waitMsg: perfil.etiquetas.generateCaptchaMask,
                                failure: function(form, action) {
                                    Secodena.ocultarMascara('maskClaveMod');
                                    captcha = action.result.datos;
                                    document.getElementById('img_captcha').src = '../../captcha/' + captcha + '.png';
                                    document.getElementById('img_captcha').hidden = false;
                                }
                            });
                        }
                        else
                            mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                    }
                });
                this.btnAyuda = new Ext.Button({
                    id: 'btnAyuCaptacha',
                    iconCls: 'ayuda',
                    text: '<b>Ayuda</b>',
                    disabled: false,
                    toolTip: perfil.etiquetas.textToolTipHelp,
                    //icon: perfil.dirImg + 'ayuda.png',
                    hotKey: {
                        idGrupo: 'Captcha',
                        config: {
                            key: 104,
                            alt: true
                        }
                    }, handler:function(){
                        ayuda.show('2','/seguridad/', 'captcha/btnAyuCaptacha');
                    }/*,

                    menu:
                            new Ext.menu.Menu({
                                id: 'mainMenu',
                                items: [
                                    {
                                        handler: function() {
                                            cargarAyuda();
                                        },
                                        text: 'Ayuda',
                                        id: 'btnAyuDesktop',
                                        icon: perfil.dirImg + 'ayuda.png',
                                        iconCls: 'btn',
                                        tooltip: 'Ayuda del sistema'
                                    },
                                    {
                                        text: 'Acerca de',
                                        id: 'acercade',
                                        icon: perfil.dirImg + 'info.png',
                                        iconCls: 'btn',
                                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                                        handler: function() {

                                            var uri = "seguridad";
                                            acercaDe.show(uri);
                                        }}
                                ]
                            })*/

                });
                this.CaptchaPanel = new Ext.FormPanel({
                    title: perfil.etiquetas.CaptchaPanel,
                    labelAlign: 'top',
                    frame: true,
                    reader: new Ext.data.JsonReader({
                        root: 'datos'
                    }, [
                        {
                            name: 'texpiracion',
                            mapping: 'texpiracion'
                        },
                        {
                            name: 'factive',
                            mapping: 'factive'
                        },
                        {
                            name: 'wordlength',
                            mapping: 'wordlength'
                        },
                        {
                            name: 'DotNoiseLevel',
                            mapping: 'DotNoiseLevel'
                        },
                        {
                            name: 'LineNoiseLevel',
                            mapping: 'LineNoiseLevel'
                        },
                        {
                            name: 'FontSize',
                            mapping: 'FontSize'
                        },
                        {
                            name: 'lineNoiseColor',
                            mapping: 'lineNoiseColor'
                        },
                        {
                            name: 'backgroundColor',
                            mapping: 'backgroundColor'
                        },
                        {
                            name: 'textColor',
                            mapping: 'textColor'
                        },
                        {
                            name: 'isEnabled',
                            mapping: 'isEnabled'
                        },
                        {
                            name: 'dotNoiseColor',
                            mapping: 'dotNoiseColor'
                        }
                    ]),
                    bodyStyle: 'padding:5px 5px 5px 5px',
                    items: [{
                            layout: 'column',
                            items: [
                                {
                                    width: 300,
                                    minWidth: 300,
                                    bodyStyle: 'padding:5px 0 5px 5px',
                                    layout: 'form',
                                    items: [
                                        new Ext.form.FieldSet({
                                            title: perfil.etiquetas.captchaConfig,
                                            id: 'imagenPropertyfieldset',
                                            width: 275,
                                            height: 375,
                                            minWidth: 275,
                                            minHeight: 375,
                                            items: [
                                                {
                                                    xtype: 'checkbox',
                                                    id: 'isEnabled',
                                                    boxLabel: perfil.etiquetas.isEnabled,
                                                    hideLabel: true,
                                                    name: 'isEnabled',
                                                    anchor: '80%',
                                                    listeners: {
                                                        check: function() {
                                                            if (Ext.getCmp('isEnabled') && Ext.getCmp('isEnabled').getValue() == true) {
                                                                Ext.getCmp('texpiracion').enable();
                                                                Ext.getCmp('wordlength').enable();
                                                                Ext.getCmp('FontSize').enable();
                                                                Ext.getCmp('cfactive').enable();
                                                                Ext.getCmp('cbackgroundColor').enable();
                                                                Ext.getCmp('ctextColor').enable();
                                                                Ext.getCmp('DotNoiseLevel').enable();
                                                                Ext.getCmp('LineNoiseLevel').enable();
                                                                Ext.getCmp('clineNoiseColor').enable();
                                                                Ext.getCmp('cdotNoiseColor').enable();
                                                                Ext.getCmp('actualizarCaptcha').enable();
                                                                Ext.getCmp('actualizarCaptcha').show();                                                                
                                                            } else if (Ext.getCmp('isEnabled') && Ext.getCmp('isEnabled').getValue() == false) {
                                                                Ext.getCmp('texpiracion').disable();
                                                                Ext.getCmp('wordlength').disable();
                                                                Ext.getCmp('FontSize').disable();
                                                                Ext.getCmp('cfactive').disable();
                                                                Ext.getCmp('cbackgroundColor').disable();
                                                                Ext.getCmp('ctextColor').disable();
                                                                Ext.getCmp('DotNoiseLevel').disable();
                                                                Ext.getCmp('LineNoiseLevel').disable();
                                                                Ext.getCmp('clineNoiseColor').disable();
                                                                Ext.getCmp('cdotNoiseColor').disable();
                                                                Ext.getCmp('actualizarCaptcha').disable();
                                                                Ext.getCmp('actualizarCaptcha').hide();
                                                                document.getElementById('img_captcha').hidden = true;
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    id: 'texpiracion',
                                                    fieldLabel: perfil.etiquetas.Ttexpiracion,
                                                    minValue: 60,
                                                    maxValue: 3600,
                                                    allowBlank:false,
                                                    name: 'texpiracion',
                                                    anchor: '80%'
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.Twordlength,
                                                    name: 'wordlength',
                                                    minValue: 4,
                                                    maxValue: 8,
                                                    allowBlank:false,
                                                    id: 'wordlength',
                                                    anchor: '80%',
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.TFontSize,
                                                    name: 'FontSize',
                                                    minValue: 15,
                                                    maxValue: 25,
                                                    allowBlank:false,
                                                    id: 'FontSize',
                                                    anchor: '80%',
                                                },
                                                new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'cfactive',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.factive,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadFont',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'factive',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'factive',
                                                                mapping: 'factive'
                                                            },
                                                            {
                                                                name: 'value',
                                                                mapping: 'value'
                                                            }])
                                                    }),
                                                    valueField: 'value',
                                                    displayField: 'factive',
                                                    hiddenName: 'factive',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                }), new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'cbackgroundColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.lbBackgroundColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadBackgroundColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'backgroundColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'backgroundColor',
                                                                mapping: 'backgroundColor'
                                                            }])
                                                    }),
                                                    valueField: 'backgroundColor',
                                                    displayField: 'backgroundColor',
                                                    hiddenName: 'backgroundColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                }), new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'ctextColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.lbTextColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadTextColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'textColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'textColor',
                                                                mapping: 'textColor'
                                                            }])
                                                    }),
                                                    valueField: 'textColor',
                                                    displayField: 'textColor',
                                                    hiddenName: 'textColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                })
                                            ]
                                        })

                                    ]
                                }, {
                                    width: 300,
                                    minWidth: 300,
                                    bodyStyle: 'padding:5px 0 5px 5px',
                                    layout: 'form',
                                    items: [
                                        new Ext.form.FieldSet({
                                            title: perfil.etiquetas.noiseConfig,
                                            id: 'cimagenColorfieldset',
                                            width: 275,
                                            height: 248,
                                            minWidth: 275,
                                            minHeight: 248,
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.TDotNoiseLevel,
                                                    name: 'DotNoiseLevel',
                                                    minValue: 50,
                                                    maxValue: 150,
                                                    allowBlank:false,
                                                    id: 'DotNoiseLevel',
                                                    anchor: '80%',
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: perfil.etiquetas.TLineNoiseLevel,
                                                    name: 'LineNoiseLevel',
                                                    minValue: 5,
                                                    maxValue: 10,
                                                    allowBlank:false,
                                                    id: 'LineNoiseLevel',
                                                    anchor: '80%',
                                                },
                                                new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'clineNoiseColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.lineNoiseColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadLineColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'lineNoiseColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'lineNoiseColor',
                                                                mapping: 'lineNoiseColor'
                                                            }])
                                                    }),
                                                    valueField: 'lineNoiseColor',
                                                    displayField: 'lineNoiseColor',
                                                    hiddenName: 'lineNoiseColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%',
                                                }),
                                                new Ext.form.ComboBox({
                                                    emptyText: perfil.etiquetas.lbMsgBlankTextRef,
                                                    editable: false,
                                                    id: 'cdotNoiseColor',
                                                    enableQtip: true,
                                                    fieldLabel: perfil.etiquetas.dotNoiseColor,
                                                    store: new Ext.data.Store({
                                                        autoLoad: true,
                                                        url: arbolAcc.root.childNodes[7].attributes.controller + 'loadDotColor',
                                                        reader: new Ext.data.JsonReader({
                                                            id: 'dotNoiseColor',
                                                            root: 'datos'
                                                        },
                                                        [{
                                                                name: 'dotNoiseColor',
                                                                mapping: 'dotNoiseColor'
                                                            }])
                                                    }),
                                                    valueField: 'dotNoiseColor',
                                                    displayField: 'dotNoiseColor',
                                                    hiddenName: 'dotNoiseColor',
                                                    forceSelection: true,
                                                    typeAhead: true,
                                                    mode: 'local',
                                                    allowBlank: false,
                                                    triggerAction: 'all',
                                                    selectOnFocus: true,
                                                    anchor: '80%'
                                                })
                                            ]
                                        }), new Ext.form.FieldSet({
                                            title: perfil.etiquetas.fieldSetPreview,
                                            id: 'captchaPreview',
                                            width: 275,
                                            height: 118,
                                            minWidth: 275,
                                            minHeight: 118,
                                            items: [
                                                {
                                                    id: 'imagen',
                                                    html: '<div>' +
                                                            '<table style="margin-left: 20%; margin-bottom:1px;">' +
                                                            '<tbody>' +
                                                            '<tr>' +
                                                            '<td>' +
                                                            '<img hidden="true" id = "img_captcha" src="../../captcha/' + captcha + '.png" alt=""/>' +
                                                            '</td>' +
                                                            '</tr>' +
                                                            '</tbody>' +
                                                            '</table>' +
                                                            '</div>'
                                                }, this.actualizar]})
                                    ]
                                }
                            ]
                        }
                    ]
                });

                _this.CaptchaPanel.load({
                    url: arbolAcc.root.childNodes[7].attributes.controller + 'loadConfig',
                    waitMsg: perfil.etiquetas.msgLoad,
                    failure: function() {
                    }, callback: function() {
                    }, success: function(form, action) {
                        var resp = Ext.util.JSON.decode(action.response.responseText);
                        if (resp['datos'][0]['isEnabled'] == 'off') {
                            Ext.getCmp('texpiracion').disable();
                            Ext.getCmp('wordlength').disable();
                            Ext.getCmp('FontSize').disable();
                            Ext.getCmp('cfactive').disable();
                            Ext.getCmp('cbackgroundColor').disable();
                            Ext.getCmp('ctextColor').disable();
                            Ext.getCmp('DotNoiseLevel').disable();
                            Ext.getCmp('LineNoiseLevel').disable();
                            Ext.getCmp('clineNoiseColor').disable();
                            Ext.getCmp('cdotNoiseColor').disable();
                            Ext.getCmp('actualizarCaptcha').disable();
                            Ext.getCmp('actualizarCaptcha').hide();
                            document.getElementById('img_captcha').hidden = true;
                        } else {
                            generatePreview();
                            Ext.getCmp('actualizarCaptcha').show();
                        }
                    }
                });
                this.items = [_this.CaptchaPanel];
                this.tbar = [_this.guardarCaptcha, '->', _this.btnAyuda];

                Configuracion.ConfGeneral.superclass.initComponent.call(this);
                function generatePreview() {
                    if (_this.CaptchaPanel.getForm().isValid()) {

                        _this.CaptchaPanel.getForm().submit({
                            url: arbolAcc.root.childNodes[7].attributes.controller + 'generate',
                            waitMsg: perfil.etiquetas.generateCaptchaMask,
                            failure: function(form, action) {
                                Secodena.ocultarMascara('maskClaveMod');
                                captcha = action.result.datos;
                                document.getElementById('img_captcha').src = '../../captcha/' + captcha + '.png';
                                document.getElementById('img_captcha').hidden = false;
                            }
                        });
                    } else {
                        mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                    }
                }

                ////------------ Modificar clave ------------////
                function SalvarConfiguracionCaptcha() {
                    if (_this.CaptchaPanel.getForm().isValid()) {
                        _this.CaptchaPanel.getForm().submit({
                            url: arbolAcc.root.childNodes[7].attributes.controller + 'saveConfig',
                            waitMsg: perfil.etiquetas.savingConfigMask,
                            failure: function(form, action) {
                                Secodena.ocultarMascara('maskClaveMod');
                                if (action.result.codMsg == 1) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    }
                    else
                        mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                }

                function cargarAyuda() {
                    help.show('Ayuda de captcha', 'seguridad/captcha');
                }
            }
        }
)