Ext.define('ConfContratacion.view.GridFiltros', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridfiltros',
    height: 380,
    border: false,
    frame: false,
    margin: false,
    viewConfig: {
        stripeRows: true
    },
    selModel: {mode: 'MULTI'},
    selType: 'checkboxmodel',
    autoScroll: true,
    initComponent: function () {
        this.getLang();

        this.cmbFiltro = this.createCmbFiltro();

        this.store = Ext.create('ConfContratacion.store.Filtro');

        this.columns = [
            {
                text: 'Filtro',
                dataIndex: 'field',
                flex: 0.8,
                editor: this.cmbFiltro
            },
            {
                text: 'Condicion',
                dataIndex: 'idcomparison',
                flex: 0.5
            },
            {
                text: 'Valor',
                dataIndex: 'idvalue',
                flex: 1
            }
        ];

        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });

        this.plugins = [this.cellEditing];

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'addrule',
            iconCls: 'adicionar',
            text: this.etiquetas.lbBtnAdd,
            tooltip: '',
            handler: this.addRecord.bind(this)
        });

        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'delrule',
            disabled: true,
            text: this.etiquetas.lbBtnDel,
            tooltip: '',
            handler: this.delRecord.bind(this)
        });

        this.tbar = [this.btnAdd, this.btnDel];

        this.callParent();
    },

    createCmbFiltro: function () {
        var stFiltros = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                {name: 'name'},
                {name: 'config', type: 'array'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getFiltros'}, ModuleMgr.get('ConfContratacion')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success',
                    idProperty: 'name'
                },
                extraParams:{
                    modelName: this.modelName
                }
            }
        });

        return Ext.create('Ext.form.ComboBox', {
            store: stFiltros,
            queryMode: 'local',
            typeAhead: true,
            flex: 1,
            displayField: 'name',
            valueField: 'name',
            allowBlank: false,
            forceSelection: true,
            listConfig: {
                loadingText: this.etiquetas.msgLoading,
                emptyText: '<div class="x-grid-empty">' + this.etiquetas.msgNoDataLoaded + '</div>'
            }
        })
    },

    addRecord: function () {
        var record = new ConfContratacion.model.Filtro({
            idfiltro: null,
            filtro: null,
            condicion: null,
            idvalor: null,
            valor: null
        });

        this.getStore().add(record);

        this.cellEditing.startEditByPosition({
            row: this.getStore().getCount() - 1,
            column: 0
        });
    },

    delRecord: function () {
        var records = this.getSelectionModel().getSelection();

        this.getStore().remove(records);
    }

});
