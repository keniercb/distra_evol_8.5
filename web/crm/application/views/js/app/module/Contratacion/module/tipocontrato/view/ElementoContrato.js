Ext.define('TipoContrato.view.ElementoContrato', {
    extend: 'TipoContrato.view.Tree',
    alias: 'widget.treeElementoContrato',
    rootVisible: true,

    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        this.tbarEC = Ext.create('TipoContrato.view.ToolBar', {
            context: 'treeEC',
            selector:'ElementoContrato'
        });
        this.cmbTipo = Ext.create('TipoContrato.view.CmbTipoElemento');

        this.tfFuente = Ext.create('Ext.form.field.Text', {
            width: 340,
            margins: '5 5 0 1',
            allowBlank: false,
            readOnly: true,
            action: 'fuente'
        });
        this.taDescripcion = Ext.create('Ext.form.field.TextArea', {
            width: 340,
            margins: '5 5 0 1'
        });
        this.tbar = [this.tbarEC];
        this.columns = [
            Ext.create('Ext.tree.Column', {
                text: me.etiquetas.lbNombre,
                dataIndex: 'denominacion',
                flex: 0.4,
                editor: Ext.create('Ext.form.field.Text', {
                    allowBlank: false,
                    selectOnFocus: true,
                    allowOnlyWhitespace: false,
                    maxLength: 255,
                    maskRe: /^([a-zA-Z0-9\s\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]*)+$/,
                    regex: /^([a-zA-Z0-9\s\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]*)+$/,
                    regexText: me.etiquetas.lbAlfanumerico
                })
            }), {
                text: me.etiquetas.lbComponente,
                dataIndex: 'humanlabel',
                flex: 0.2,
                editor: this.cmbTipo
            }, {
                text: me.etiquetas.lbFuente,
                dataIndex: 'model',
                flex: 0.2,
                editor: this.tfFuente
            }, {
                text: me.etiquetas['lbDescripcion'],
                dataIndex: 'descripcion',
                maxLength: 255,
                flex: 0.2,
                editor: this.taDescripcion
            }, {
                dataIndex: 'idelemento', hidden: true, hideable: false
            }, {
                xtype: 'actioncolumn',
                width: 18,
                height: 12,
                margins: '3 0 0 1',
                cls: 'icondistra-configuracion',
                menuDisabled: true,
                sortable: false,
                hideable: false,
                context: 'cfgETC',
                tooltip: me.etiquetas.tpConfigETC,
                renderer: function (me, eOpts) {
                    if (eOpts.record.data.id != 0) {
                        this.iconCls = 'icondistra-configuracion';
                    }else{
                        this.iconCls = '';
                    }
                },
                keyMap: {
                    key: 'f',
                    alt: true,
                    ctrl: true,
                    event: 'click'
                }
            }
        ];

        this.callParent();
    }
});