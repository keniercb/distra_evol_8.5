/**
 * @class Ext.DatMaest.ClientProveed
 * @extends Ext.panel
 * @author Ing. Alberto Mesa Martínez
 */
Ext.ns('Ext.DatMaest.ClientProveed');
Ext.DatMaest.ClientProveed.WindowConfig = Ext.extend(Ext.Window, {
    layout: 'border',
    modal: true,
    constrain: true,
    perfil: window.parent.UCID.portal.perfil,
    height: 220, //285,
    width: 450,
    constructor: function (params) {
        this.etiquetas = params.etiquetas || {};
        this.title = "Configuración";
        this.createItems(params);
        Ext.DatMaest.ClientProveed.WindowConfig.superclass.constructor.call(this, params);
        this.addEvents('espaciotrabajoconfigurado');
        this.createEvents();
    },
    createItems: function (params) {
        var me = this;

        this.idclienteproveedorespacio = new Ext.form.Hidden({
            name: 'idclienteproveedorespacio',
            allowBlank: false
        });

        this.to = new Ext.form.TextField({
            fieldLabel: 'Correo general',
            name: 'to',
            anchor: '100%',
            allowBlank: false
        });
		

        this.form = new Ext.form.FormPanel({
            region: 'center',
            // layout: 'border',
            trackResetOnLoad: true,
            frame:true,
            // labelAlign: 'top',
            defaults: {
                margin: '5 5 15 5'
            },
            items:[
                {
                    layout: 'column',
                    style: 'margin:5 0 10 5',
                    items:[
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Activo Gestor Documental',
                            name: 'activo',
                            columnWidth: 1
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    title: 'Aviso próximo a expirar',
                    layout: 'column',
                    height: 100,
                    items: [
                        {
                            layout: 'column',
                            columnWidth: 1,
                            // margin: '10 5 10 5',
                            style: 'margin:0 0 15 0',
                            items: [
                                {
                                    xtype: 'label',
                                    columnWidth: 0.12,
                                    text: 'Avisar',
                                    style: 'margin:5 10 0 5',
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: 'Avisar',
                                    name: 'diasaviso',
                                    columnWidth: 0.1,
                                    width: 100,
                                    minValue: 1,
                                    value: 30
                                },
                                {
                                    xtype: 'label',
                                    text: 'días antes',
                                    columnWidth: 0.78,
                                    style: 'margin:5 0 0 10',
                                }
                            ]
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'Enviar correo',
                            name: 'enviarcorreoaviso',
                            columnWidth: 0.3,
                            listeners: {
                                scope: this,
                                check: function (obj) {
                                    this.form.find('name', 'correoaviso')[0].setDisabled(!obj.checked);
                                }
                            }
                        },
                        {
                            xtype: 'label',
                            text: 'A:',
                            style: 'margin:5 10 0 5',
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Correo',
                            name: 'correoaviso',
                            columnWidth: 0.7,
                            disabled: true,
                            allowBlank: false
                        },
                    ]
                },
                // {
                //     xtype: 'fieldset',
                //     title: 'Aviso de expiración',
                //     layout: 'column',
                //     height: 60,
                //     items: [
                //         {
                //             xtype: 'checkbox',
                //             boxLabel: 'Enviar correo',
                //             name: 'enviarcorrevencido',
                //             columnWidth: 0.3,
                //             listeners: {
                //                 scope: this,
                //                 check: function (obj) {
                //                     this.form.find('name', 'correovencido')[0].setDisabled(!obj.checked);
                //                 }
                //             }
                //         },
                //         {
                //             xtype: 'label',
                //             text: 'A:',
                //             style: 'margin:5 10 0 5',
                //         },
                //         {
                //             xtype: 'textfield',
                //             fieldLabel: 'Correo',
                //             name: 'correovencido',
                //             columnWidth: 0.7,
                //             disabled: true,
                //             allowBlank: false
                //         }
                //     ]
                // }
            ]
        });

        this.items=[this.form];

//         this.items = [this.form, this.tree];

        this.defaultButton = this.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: this.etiquetas.lbBtnCancelar,
            tooltip: this.etiquetas.lbTtCancelar,
            handler: function () {
                me.destroy();
            }
        });

        this.btnAccept = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: this.etiquetas.lbBtnAceptar,
            tooltip: this.etiquetas.lbTtAceptar
        });

        this.buttons = [this.btnCancel, this.btnAccept];
    },
    createEvents: function () {
        var me = this;
        this.on({
            show: function () {
                this.showMask();
                Ext.Ajax.request({
                    url: '/crm/configuracion/index.php/confcontratacion/loadConfClientesproveedores',
                    scope: this,
                    callback: function (options, success, response) {
                        this.loadMask.hide();
                        var response = Ext.decode(response.responseText);
                        if (response.config && response.config['idconfclientesproveedores']) {
                            var datos = response.config['config']?Ext.decode(response.config['config']):{};
                            datos['activo'] = response.config['activo']=="1";
                            this.form.getForm().setValues(datos);
                            me.gridPrincipal.config = datos;
                        }
                    }
                });
                this.closed = false;
                Ext.TaskMgr.start({
                    run: this.checkWindow.bind(this),
                    interval: 100,
                    scope: this
                });
            },
            destroy: function () {
                this.closed = true;
            }
        });

        this.btnAccept.on({
            scope: this,
            click: this.salvarConfVencimiento
        });
    },
    showMask: function (msg) {
        var msg = msg || this.etiquetas.lbCargando;
        this.loadMask = new Ext.LoadMask(this.el, {msg: msg});
        this.loadMask.show();
    },
    showMessageBox: function (title, msg) {
        title = title || this.etiquetas.lbEsperando;
        msg = msg || 'Guardando configuración';

        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    checkWindow: function () {
        if (!this.closed) {
            var form = this.form.getForm();
//             console.log(form.isValid(), form.isDirty());
            if (form.isValid() && form.isDirty()) {
                this.btnAccept.enable();
            } else {
                this.btnAccept.disable();
            }
        } else {
            return false;
        }

    },
    salvarConfVencimiento: function () {
        var me = this;
        this.showMessageBox();
        // this.form.getForm().submit({
        console.log(this.form.getForm())
        var formValues = this.form.getForm().getValues(),
            conf = {
                activo: formValues.activo?'true':'false',
                config: formValues
            };
        Ext.Ajax.request({
            url: '/crm/configuracion/index.php/confcontratacion/saveConfClientesproveedores',
            method: 'POST',
            params: {
                clientesproveedores: Ext.encode(conf),
            },
            // url: 'salvarConfVencimiento',
            success: function (form, action) {
                me.setOriginalValue();
                mostrarMensaje(1, 'La configuración ha sido guardada satisfactoriamente.');
                // if(me.idclienteproveedorentidad && me.gridPrincipal){
                me.gridPrincipal.config = formValues;
                me.gridPrincipal.store.load();
                // }
                me.destroy();
                // me.fireEvent('espaciotrabajoconfigurado');
                Ext.MessageBox.hide();
            },
            failure: function (form, action) {
                mostrarMensaje(6, me.etiquetas.msgDefaultError);
                Ext.MessageBox.hide();
            }
        })
    },
    setOriginalValue: function () {
        this.idclienteproveedorespacio.originalValue = this.idclienteproveedorespacio.getValue();
        // this.idespaciotrabajo.originalValue = this.idespaciotrabajo.getValue();
        // this.nombreespaciotrabajo.originalValue = this.nombreespaciotrabajo.getValue();
    }

});
