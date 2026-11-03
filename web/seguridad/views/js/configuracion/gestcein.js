/**
 * Created by root on 12/06/17.
 */
Ext.ns("cein");

var moduloCein;

Ext.Ajax.request({
    url: 'tieneModuloCein',
    callback: function (option, success, resp) {
        var response = JSON.parse(resp.responseText);
        if (response.success) {
            moduloCein = true;
        }else{
            moduloCein = false;
        }
    }
});

Configuracion.cein = Ext.extend(Ext.Panel,
    {
        id: 'cein',
        layout: 'accordion',
        border: false,
        defaults: {border: false},
        //animate: true,
        //sequence: true,
        initComponent: function () {
            var _this = this,
                originalIpValue = '',
                originalPortValue = '';


            this.configurarCeinClient = new Ext.Button({
                id: 'configurarCeinClient',
                tooltip: perfil.etiquetas.textToolTipGuardar,
                disabled: true,
                iconCls: 'guardar',
                text: 'Guardar',
                listeners: {
                    'render': function(btn) {
                        if (moduloCein){
                            btn.setVisible(false);
                        }

                    },
                    'click': configurarCeinClient,
                    'enable': function (me) {
                        var form = Ext.getCmp('formConfigCein').getForm();
                        if (!form.isValid()) {
                            me.setDisabled(true);
                        }
                    }
                }
            });
            this.spantpl = new Ext.Template(
                '<tpl>' +
                '<span class="icondistra-{icono} {color}"/>' +
                '</tpl>'
            );

            this.configceinclient = new Ext.FormPanel({
                id: 'formConfigCein',
                title: 'Centralizador de incidencias',
                defaults: {
                    style: {
                        padding: '7px',
                    },
                    height: 200,
                    border: false
                },
                bodyStyle: 'padding:5px 5px 5px 5px',
                validationStatus: false,
                frame: true,
                layout: 'column',
                border: false,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'ipCein', mapping: 'ipCein'},
                    {name: 'port', mapping: 'port'}/*,
                    {name: 'radio', mapping: 'radio'}*/
                ]),
                items: [
                    {
                        columnWidth: .25,
                        defaults: {width: '91.8%'},
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Datos centralizador',
                                id: 'idDatosCentralizador',
                                layout: 'form',
                                defaults: {width: '90%'},
                                autoHeight: true,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Direcci&oacute;n',
                                        id: 'ipCein',
                                        name: 'ipCein',
                                        allowBlank: false,
                                        enableKeyEvents: true,
                                        regex: /^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})|((([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.))([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})$/,
                                        blankText: perfil.etiquetas.lbMsgBlankTextRef,
                                        listeners: {
                                            'keyup': function () {
                                                originalIpValue = (originalIpValue == '') ?
                                                    Ext.getCmp('ipCein').value : originalIpValue;
                                                var newValue = Ext.get('ipCein').dom.value;
                                                Ext.getCmp('ipCein').value = newValue;
                                                if (newValue == '') {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                } else if (newValue != originalIpValue) {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(false);
                                                } else {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        id: 'puerto',
                                        name: 'port',
                                        fieldLabel: 'Puerto',
                                        enableKeyEvents: true,
                                        maxValue: 65536,
                                        listeners: {
                                            'keyup': function () {
                                                originalPortValue = (originalPortValue == '') ?
                                                    Ext.getCmp('puerto').value : originalPortValue;
                                                var newValue = Ext.get('puerto').dom.value;
                                                Ext.getCmp('puerto').value = newValue;
                                                if (newValue == '') {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                } else if (newValue != originalPortValue) {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(false);
                                                } else {
                                                    Ext.getCmp('configurarCeinClient').setDisabled(true);
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                layout: 'column',
                                border: true,
                                autoHeight: true,
                                title: 'Estado de los servicios SOAP',
                                items: [
                                    {
                                        columnWidth: .6,
                                        xtype: 'textfield',
                                        value: 'CeinSoapService',
                                        id: 'CeinSoapService',
                                        readOnly: true,
                                        hideLabel: true,
                                        style: 'padding-left:5px;'
                                    },
                                    {
                                        columnWidth: .2,
                                        id: 'divContainer',
                                        html: '',
                                        style: 'padding: 3px;padding-left:4px;',
                                        listeners: {
                                            beforerender: function (t) {
                                                Secodena.mostrarMascara('testSoapServiceMask', 'Verificando servicios SOAP...', 'Verificando servicios SOAP...');
                                                Ext.Ajax.request({
                                                    url: 'testSoapService',
                                                    success: function (resp) {
                                                        if (typeof t.items != 'undefined') {
                                                            t.remove('spancerrar', true);
                                                            t.remove('spanok', true);
                                                        }
                                                        var response = JSON.parse(resp.responseText);
                                                        if (response.success) {
                                                            if (typeof t.items != 'undefined') {
                                                                t.remove('spancerrar', true);
                                                            }
                                                            t.add({
                                                                id: 'spanok',
                                                                html: _this.spantpl.apply({icono: 'ok', color: 'verde'})
                                                            });
                                                            //Ext.getCmp('configurarCein').disable();
                                                        } else {
                                                            mostrarMensaje(6, 'Los servicios SOAP no se encuentran disponibles.');
                                                            if (typeof t.items != 'undefined') {
                                                                t.remove('spanok', true);
                                                            }
                                                            t.add({
                                                                id: 'spancerrar',
                                                                html: _this.spantpl.apply({
                                                                    icono: 'cerrar',
                                                                    color: 'rojo'
                                                                })
                                                            });

                                                            if (moduloCein) {
                                                                Ext.getCmp('configurarCein').show();
                                                                Ext.getCmp('configurarCein').enable();
                                                            }

                                                        }
                                                        Secodena.ocultarMascara('testSoapServiceMask');
                                                        t.doLayout();
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    {
                                        columnWidth: .2,
                                        id: 'buttonContainer',
                                        listeners: {
                                            beforerender: function (t) {
                                                if (moduloCein) {
                                                    Ext.getCmp('configurarCein').show();
                                                } else {
                                                    Ext.getCmp('configurarCein').hide();
                                                }
                                            }
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'configurar',
                                                id: 'configurarCein',
                                                // disabled: true,
                                                tooltip: 'Configurar ',
                                                style: 'margin-left:5px;',
                                                listeners: {
                                                    click: function () {
                                                        Ext.Ajax.request({
                                                            url: 'configurarCeinWsdl',
                                                            success: function (resp) {
                                                                if (resp.responseText == "") {
                                                                    //Ext.getCmp('tabPanel').setActiveTab('cein');
                                                                    Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                                                                    mostrarMensaje(7, 'Servicio configurado correctamente.');
                                                                } else {
                                                                    mostrarMensaje(6, 'No se puede configurar el servicio debido a permisos de escritura.');
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                            /*{
                                xtype: 'fieldset',
                                title: 'Protocolo',
                                autoHeight: true,
                                layout: 'column',
                                items: [{
                                    xtype: 'radio',
                                    checked: true,
                                    name: 'radio',
                                    boxLabel: 'http',
                                    inputValue: 'http',
                                    columnWidth: .5
                                },
                                    {
                                        xtype: 'radio',
                                        name: 'radio',
                                        boxLabel: 'https',
                                        inputValue: 'https',
                                        columnWidth: .5
                                    }]
                            },*/
                        ]
                    },
                    {
                        columnWidth: .75,
                        items: [
                            {
                                xtype: 'fieldset',
                                id: 'idFieldsetInfo',
                                height: 151,
                                title: 'Información',
                                html: perfil.etiquetas.htmlconfigurarCeinClient
                            }]
                    }
                ],
                buttons: [_this.configurarCeinClient],
                buttonAlign: 'right',
                listeners: {
                    'render': function (t) {
                        if (moduloCein) {
                            Ext.getCmp('ipCein').setDisabled(true);
                            Ext.getCmp('puerto').disable();
                            Ext.getCmp('idDatosCentralizador').setVisible(false);
                            Ext.getCmp('idFieldsetInfo').setHeight(60);
                        } else {
                            Ext.getCmp('ipCein').enable();
                            Ext.getCmp('puerto').enable();
                        }
                    }
                }
            });

            this.items = [
                _this.configceinclient
            ];
            this.configceinclient.load({
                url: 'configurar',
                waitMsg: perfil.etiquetas.msgLoad,
                success: function (t) {
                    Ext.getCmp('formConfigCein').validationStatus = t.getValues();
                }
            });
            this.border = false;
            this.on('beforedestroy', function (t) {
                t.hide();
                return false;
            }, this);
            Configuracion.cein.superclass.initComponent.call(this);

            function configurarCeinClient(me) {
                var form = Ext.getCmp('formConfigCein').getForm();
                if (form.isValid()) {
                    form.submit({
                        url: 'configurarceinclient',
                        success: function (form, action) {
                            Ext.getCmp('divContainer').fireEvent('beforerender', Ext.getCmp('divContainer'));
                            originalIpValue = Ext.getCmp('ipCein').value;
                            originalPortValue = Ext.getCmp('puerto').value;
                            me.setDisabled(true);
                            mostrarMensaje(7, action.result.message);
                        },
                        failure: function (form, action) {
                            mostrarMensaje(6, action.result.message);
                        }
                    });
                }
            }
        }
    }
);