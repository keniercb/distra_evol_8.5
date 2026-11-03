Ext.define('ConfigFormatoNumContrato.view.GpElementosIncrementales', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gpelementosincrementales',
    region: 'center',
    height: 150,
    selModel: {
        selType: 'cellmodel'
    },
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.store = Ext.create('ConfigFormatoNumContrato.store.ElementosIncrementales');
        me.title = me.etiquetas.titleGpElementosIncrementales;

        me.addEvents('grideditorvalidate');

        me.plugins=[new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1,
            listeners:{
                validateedit: function(editor, context){
                    me.fireEvent("grideditorvalidate", editor, context);
                },
                scope: me
            }
        })];

        me.columns = [
            {
                text: me.etiquetas.lbElemento,
                sortable: false,
                flex: 2,
                dataIndex: 'denominacion'
            },{
                text: me.etiquetas.lbValorInicial,
                sortable: false,
                flex: 1,
                dataIndex: 'valorinicial',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    maskRe: /^([\d]+(\d*)?)+$/,
                    regex: /^([\d]+(\d*)?)+$/,
                    regexText: this.etiquetas.msgValidationOnlyNumber,
                }
            },{
                text: me.etiquetas.lbValorActual,
                sortable: false,
                flex: 1,
                dataIndex: 'valor',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false,
                    maskRe: /^([\d]+(\d*)?)+$/,
                    regex: /^([\d]+(\d*)?)+$/,
                    regexText: this.etiquetas.msgValidationOnlyNumber,
                }
            }
        ];

        me.tbar= [
            {
                text: me.etiquetas.btnReset,
                iconCls: 'icondistra-reevaluacion',
                tooltip: me.etiquetas.qtipBtnReset,
                action: 'reset',
            }
        ];

        me.callParent();
    }
});
