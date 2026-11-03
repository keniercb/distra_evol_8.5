Ext.define('TipoContrato.view.TipoContrato', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeTipoContrato',
    rootVisible: true,
    hideHeaders: true,
    loadMask: true,
    border: false,
    useArrows: true,
    multiSelect: true,
    viewConfig: {
        bubbleEvents: ['refresh'],
        loadMask: true
    },
    cls: 'crm-icon-tree',
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(this);

        me.store = Ext.create('TipoContrato.store.TipoContrato', {
            autoLoad: false,
            root: {
                denominacion: me.etiquetas.lbTipoContrato,
                id: 0,
                expanded: true
            }
        });

        this.btnActualizar = Ext.create('Ext.Button', {
            iconCls: 'icondistra-actualizar',
            action: 'update',
            tooltip: me.etiquetas.tpActualizar,
            keyMap: {
                key: 'z',
                alt: true,
                ctrl: true,
                event: 'click'
            }
        });
        this.btnCancelar = Ext.create('Ext.Button', {
            text: me.etiquetas.cancelar,
            iconCls: 'icondistra-cancelar',
            disabled: true,
            hidden: true,
            action: 'cancel',
            selector: 'cancelTipoContrato',
            tooltip: me.etiquetas.tpcancelar,
            keyMap: {
                key: 'x',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });
        this.btnGuardar = Ext.create('Ext.Button', {
            text: me.etiquetas.guardar,
            tooltip: me.etiquetas.tpguardar,
            disabled: true,
            hidden: true,
            action: 'save',
            selector: 'saveTipoContrato',
            iconCls: 'icondistra-guardar',
            keyMap: {
                key: 'g',
                alt: true,
                ctrl: false,
                event: 'click'
            }
        });
        this.tbarTC = Ext.create('TipoContrato.view.ToolBar', {
            context: 'treeTC',
            selector:'TipoContrato'
        });
        this.tbar = [this.tbarTC];

        this.bbar = [this.btnActualizar, '->', this.btnCancelar, this.btnGuardar];

        this.columns = [
            {dataIndex: 'idtipocontrato', hidden: true},
            Ext.create('Ext.tree.Column', {
                dataIndex: 'denominacion',
                flex: 1,
                editor: Ext.create('Ext.form.field.Text', {
                    allowBlank: false,
                    selectOnFocus: true,
                    allowOnlyWhitespace: false,
                    maxLength: 255,
                    maskRe: /^([a-zA-Z0-9\s\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]*)+$/,
                    regex: /^([a-zA-Z0-9\s\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]+ ?[a-zA-Z0-9\xC1\xE1\xE9\xC9\xCD\xED\xF3\xD3\xDA\xFA\xD1\xF1\(\)\_\-\.\,]*)+$/,
                    regexText: me.etiquetas.lbAlfanumerico
                })
            }),
            {dataIndex: 'idestructuracomun', hidden: true},
            {dataIndex: 'tipo', hidden: true},
            {dataIndex: 'editable', hidden: true}
        ];

        this.plugins = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            listeners: {
                beforeedit: function (e, editor) {
                    if (!e.context.record.data.editable)
                        return false;
                }
            }
        });

        this.callParent();
    }
});