Ext.define('Facturacion.view.DocumentWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.fac_documentwindow',
    margin: false,
    width: 300,
    height: 160,
    closable: true,
    closeAction: 'destroy',
    layout: 'fit',
    modal: true,
    resizable: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.title = me.etiquetas.titleAddDocument;

        me.createBody();

        me.callParent();
    },
    createBody: function () {
        var me = this;


        me.nombre = Ext.create('Ext.form.field.Text', {
            fieldLabel: me.etiquetas.lbName,
            name: 'nombre',
            maxLength: 100,
            anchor: '100%',
            allowBlank: true,
            listeners: {
                change: function (field, value) {
                    var required = value ? '<span style="color:red;font-weight:bold">*</span>' : '',
                        allowBlank = value ? false : true,
                        fieldLabel = me.documento.allowBlank ? me.documento.fieldLabel + ':' + required : me.documento.labelEl.dom.innerHTML;
                    me.documento.labelEl.dom.innerHTML = fieldLabel;
                    me.documento.allowBlank = value ? false : true;
                    me.documento.validate();
                }
            }
        });

        me.documento = Ext.create('Ext.form.field.File', {
            fieldLabel: me.etiquetas.lbdocumento,
            allowBlank: true,
            name: 'documento',
            buttonText: '',
            buttonConfig: {
                iconCls: 'icondistra-subirfichero icon-fileupload'
            },
            anchor: '100%',
            listeners: {
                change: function (field, value) {
                    var required = value ? '<span style="color:red;font-weight:bold">*</span>' : '',
                        allowBlank = value ? false : true,
                        fieldLabel = me.nombre.allowBlank ? me.nombre.fieldLabel + ':' + required : me.nombre.labelEl.dom.innerHTML;
                    me.nombre.labelEl.dom.innerHTML = fieldLabel;
                    me.nombre.allowBlank = value ? false : true;
                    me.nombre.validate();
                }
            }
        });

        me.form = Ext.create('Ext.form.Panel', {
            bodyStyle: 'background:#DFE9F6; padding:5px',
            fieldDefaults: {
                labelAlign: 'top'
            },
            border: false,
            items: [me.nombre, me.documento]
        });

        me.btnCancel = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            action: 'cancel',
            iconCls: 'cancelar',
            handler: function () {
                me.close();
            }
        });

        me.btnAcept = Ext.create('Ext.Button', {
            text: this.etiquetas.lbBtnAccept,
            tooltip: this.etiquetas.qtipAccept,
            action: 'acept',
            //disabled: true,
            iconCls: 'aceptar'
        });

        me.buttons = [me.btnCancel, me.btnAcept];

        me.items = [me.form];
    }
});
