Ext.define('ConfContratacion.view.GridRules', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridrules',
    border: false,
    frame: false,
    margin: false,
    height: 200,
    viewConfig: {
        stripeRows: true
    },
    selModel: {mode: 'MULTI'},
    selType: 'checkboxmodel',
    autoScroll: true,
    initComponent: function () {
        this.etiquetas = LangMgr.getLang(this);

        this.title = "Reglas";

        this.store = Ext.create('ConfContratacion.store.Rules');

        this.columns = [
            {
                text: 'Tipo',
                dataIndex: 'tiporegla',
                flex: 1
            },
            {
                text: 'Valor',
                dataIndex: 'valor',
                flex: 1,
                renderer: this.renderer
            }
        ];

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'addrule',
            iconCls: 'adicionar',
            text: 'Adicionar',
            tooltip: ''
        });

        this.btnEdit = Ext.create('Ext.Button', {
            action: 'editrule',
            iconCls: 'modificar',
            text: 'Modificar',
            disabled: true,
            tooltip: ''
        });

        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'delrule',
            disabled: true,
            text: this.etiquetas.lbBtnDel,
            tooltip: ''
        });

        this.tbar = [this.btnAdd, this.btnEdit, this.btnDel];

        this.callParent();
    },
    renderer: function (value, metaData, record) {
        if (Ext.isEmpty(record.data.valor)) {
            return record.data.nombrerol;
        }
        return value;
    }
});
