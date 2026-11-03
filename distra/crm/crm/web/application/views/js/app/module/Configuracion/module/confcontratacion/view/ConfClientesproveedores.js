Ext.define('ConfContratacion.view.ConfClientesproveedores', {
    extend: 'Ext.form.Panel',
    alias: 'widget.confclientesproveedores',
    frame: true,
    border: false,
    layout: 'border',
    trackResetOnLoad: true,
    defaults: {
        style: 'margin:5px 5px;',
        bodyStyle: 'background:#DFE9F6;padding:5px;',
        border: false
    },
    // fieldDefaults: {labelAlign: 'top'},
    initComponent: function () {
        var me = this;
        this.getLang();
        this.hdidcomitegestor = Ext.create('Ext.form.field.Hidden',{
            name:'idcontratogestordocumental'
        });

        this.active = {
            xtype: 'toggleslidefield',
            labelSeparator: '',
            name: 'activo',
            allowBlank: true,
            labelWidth: 180,
            labelStyle: 'margin-bottom:5px;color: hsl(214, 74%, 31%);font-weight: bold;',
            onText: this.etiquetas.lbActivo,
            offText: this.etiquetas.lbInactivo,
            state: false,
            labelAlign: 'top',
            fieldLabel: this.etiquetas.lbGestorDocumental
        };

        this.items = [
            {
                region:'north',
                layout: 'form',
                // height:60,
                items: [
                    this.hdidcomitegestor,
                    this.active,
                    {
                        xtype: 'fieldset',
                        title: 'Aviso próximo a expirar',
                        layout: 'column',
                        height: 100,
                        anchor: '50%',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                columnWidth: 1,
                                // frame: true,
                                border: 0,
                                // margin: '10 5 10 5',
                                style: 'margin:0 0 15 0; font-size: 12px',
                                items: [
                                    {
                                        xtype: 'label',
                                        text: 'Avisar',
                                        style: 'margin:5 10 0 5',
                                    },
                                    {
                                        xtype: 'numberfield',
                                        // fieldLabel: 'Avisar',
                                        name: 'diasaviso',
                                        width: 100,
                                        minValue: 1,
                                        value: 30
                                    },
                                    {
                                        xtype: 'label',
                                        text: 'días antes',
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
                                    change: function (obj) {
                                        // console.log('check:', obj)
                                        me.getForm().findField('correoaviso').setDisabled(!obj.checked);
                                    }
                                }
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'A',
                                labelWidth: 35,
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
                    //     anchor: '50%',
                    //     items: [
                    //         {
                    //             xtype: 'checkbox',
                    //             boxLabel: 'Enviar correo',
                    //             name: 'enviarcorrevencido',
                    //             columnWidth: 0.3,
                    //             listeners: {
                    //                 scope: this,
                    //                 change: function (obj) {
                    //                     me.getForm().findField('correovencido').setDisabled(!obj.checked);
                    //                 }
                    //             }
                    //         },
                    //         {
                    //             xtype: 'textfield',
                    //             fieldLabel: 'A',
                    //             labelWidth: 35,
                    //             name: 'correovencido',
                    //             columnWidth: 0.7,
                    //             disabled: true,
                    //             allowBlank: false
                    //         }
                    //     ]
                    // }
                ]
            }];

        this.btnSave = Ext.create('Ext.Button', {
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: true,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        this.buttons = [this.btnCancel, this.btnSave];

        this.callParent();
    }
});
