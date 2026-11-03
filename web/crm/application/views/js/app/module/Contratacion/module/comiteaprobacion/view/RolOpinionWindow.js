Ext.define('Comite.view.RolOpinionWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.rolopinionwindow',
    requires: [
        'Comite.view.TinyEditor'
    ],
    initComponent: function () {
        var me = this;
        this.getLang();

        this.width = 700;

        this.editor = Ext.create('Comite.view.TinyEditor', {
            height: 350,
            fieldLabel: this.etiquetas.lbObservacion,
            allowBlank: true,
            name: 'observacion'
        });

        this.fileupload = new Ext.create('Ext.form.field.File', {
            fieldLabel: this.etiquetas.lbContratoAdjunto,
            columnWidth: 1,
            name: 'file',
            buttonText: '',
            buttonConfig: {
                iconCls: 'icondistra-subirfichero icon-fileupload'
            }
        });

        this.btnDelFile = new Ext.create('Ext.Button', {
            tooltip: this.etiquetas.lbEliminarDocumento,
            iconCls: 'icondistra-eliminar icon-medium',
            action: 'delfile',
            hidden: true,
            margin: '18 0 0 2',
            style: {
                borderWidth: '1px !important;'
            }
        });

        this.form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            border: false,
            autoHeight: true,
            fieldDefaults: {
                labelAlign: 'top'
            },
            bodyStyle: 'background:#DFE9F6; padding:5px',
            border: false,
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                border: false
            },
            trackResetOnLoad: true,
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.editor]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.fileupload,this.btnDelFile]
                }
            ]
        });

        this.items = [this.form];
        me.callParent();
    }
});
