/**
 * Created by Miguel Antonio on 19/01/2016.
 */
Ext.ns('Ext.SUIN.Consultar');
Ext.SUIN.Consultar.pFicha = new Ext.extend(Ext.Panel, {
    layou: 'fit',
    region: 'center',
    initComponent: function () {
        var me = this;
        me.panelfoto = new Ext.ux.ScreenshotField({
            center: false,
            border: false,
            name: 'passport',
            width: 77,
            height: 77,
            cls: 'persona-ficha-panelfoto',
            value: '/pvd/persona/views/images/persona/no-photo-male.png',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        me.btnPrint = new Ext.Button({
            text: 'Exportar',
            tooltip: 'Exportar datos',
            iconCls: 'imprimir',
            disabled: true,
            //icon: perfil.dirImg + 'imprimir.png',
            handler: function () {
                me.imprimirDatos();
            }

        });
        me.fpDatos = new Ext.FormPanel({
            labelAlign: 'top',
            title: 'Datos de la persona',
            autoScroll: true,
            frame: true,
            bodyStyle: 'padding:5px',
            width: 600,
            items: [{
                layout: 'column',
                border: false,
                bodyStyle: 'padding:5px',
                items: [{
                    columnWidth: .2,
                    border: false,
                    items: me.panelfoto
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'Apellido',
                        name: 'papel',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'Segundo nombre',
                        name: 'snombre',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'Segundo apellido',
                        name: 'sapel',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .2,
                    layout: 'form',
                    border: false,
                    items: [{
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'Sexo',
                        name: 'sexo',
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        readOnly: true,
                        fieldLabel: 'No. identidad',
                        name: 'numid',
                        anchor: '95%'
                    }]
                }]
            }, {
                xtype: 'panel',
                title: 'Datos de nacimiento',
                border: true,
                defaults: {bodyStyle: 'padding:10px'},
                items: [{
                    layout: 'column',
                    border: false,
                    bodyStyle: 'padding:5px',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Nombre madre',
                            readOnly: true,
                            name: 'nomma',
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Registro civil',
                            readOnly: true,
                            name: 'registrocivil',
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Fecha nacimiento',
                            readOnly: true,
                            name: 'fechanacimiento',
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Tomo',
                            readOnly: true,
                            name: 'tomo',
                            anchor: '95%'
                        }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Nombre padre',
                            readOnly: true,
                            name: 'nompa',
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Pa&iacute;s/Provincia/Municipio',
                            name: 'paisprovmuni',
                            readOnly: true,
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'A&ntilde;o registro',
                            name: 'annoregistrocivil',
                            readOnly: true,
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Folio',
                            name: 'folio',
                            readOnly: true,
                            anchor: '95%'
                        }]
                    }]
                }]
            }, {
                xtype: 'panel',
                title: 'Datos de residencia',
                border: true,
                defaults: {bodyStyle: 'padding:10px'},
                items: [{
                    layout: 'column',
                    bodyStyle: 'padding:5px',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            readOnly: true,
                            fieldLabel: 'Provincia/Municipio',
                            name: 'provmunicres',
                            anchor: '95%'
                        }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Fecha de registro',
                            readOnly: true,
                            name: 'fechares',
                            anchor: '95%'
                        }]
                    }, {
                        columnWidth: .99,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textarea',
                            fieldLabel: 'Direcci&oacute;n',
                            readOnly: true,
                            name: 'direccion',
                            anchor: '100%'
                        }]
                    }]
                }]
            }, {
                xtype: 'panel',
                title: 'Datos fenot&iacute;picos',
                border: true,
                defaults: {bodyStyle: 'padding:10px'},
                items: [{
                    layout: 'column',
                    border: false,
                    bodyStyle: 'padding:5px',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Color ojos',
                            readOnly: true,
                            name: 'colorojos',
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Color piel',
                            name: 'colorpiel',
                            readOnly: true,
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Estatura(cm)',
                            name: 'talla',
                            readOnly: true,
                            anchor: '95%'
                        }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        border: false,
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Peso (Kg)',
                            readOnly: true,
                            name: 'peso',
                            anchor: '95%'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Color pelo',
                            name: 'colorpelo',
                            readOnly: true,
                            anchor: '95%'
                        }, {
                            xtype: 'radio',
                            boxLabel: 'Tiene huellas',
                            hideLabel: true,
                            name: 'huella',
                            anchor: '95%'
                        }]
                    }]
                }]
            }],

            buttons: [me.btnPrint]
        });
        me.items = [me.fpDatos]
        Ext.SUIN.Consultar.pFicha.superclass.initComponent.call(this)
    },
    loadData: function (data) {
        var me = this;
        me.fpDatos.getForm().loadRecord(data);
        me.btnPrint.enable();
    },
    imprimirDatos: function () {
        var me = this;
        var params = Ext.urlEncode({
            datos: Ext.encode(me.fpDatos.getForm().getValues())
        });
        var idIframe = Ext.id();
        // http://10.12.162.110:5902/pvd/comun/index.php/consultardatosuin/cargaretiquetas
        var w = new Ext.Window({
            title: 'Datos persona SUIN',
            width: '100%',
            resizable: false,
            maskDisabled: false,
            animCollapse: false,
            maximizable: true,
            constrainHeader: true,
            border: false,
            items: {
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    id: idIframe,
                    style: 'height: 100%; width: 100%; border: none',
                    src: document.location.protocol + '//' + document.location.host +
                    '/pvd/comun/index.php/consultardatosuin/exportarDatosSuin?' + params
                }
            }
        });
        w.show();
        w.maximize();
        //  PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando datos de la persona');
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Please wait..."});
        myMask.show();
        document.getElementById(idIframe).onload = function () {
            myMask.hide();
        }
    }
})