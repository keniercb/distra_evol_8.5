//Esto es para porner un panel con una página inicia
Ext.define('ConfContratacion.view.CompartGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.compartgrid',
    selType: 'checkboxmodel',
    stripeRows: true,
    multiSelect: true,

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;
        this.store = Ext.create('ConfContratacion.store.Compartimentacion');
        this.store.proxy.extraParams.modelName=me.modelName;
        this.store.load();
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;
        this.border = false;
        this.features = [{
            ftype: 'filters',
            menuFilterText: me.etiquetas.lbbusqueda,
            local: false
        }];

        //COLUMNAS
        this.columns = [
            {
                text: me.etiquetas.lbNombre,
                sortable: false,
                dataIndex: 'nombrerol',
                flex: 1,
                filter: {
                    type: 'string'
                }
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: this.store,
                pageNumb: true,
                dock: 'bottom',
                displayInfo: true,
                items: [
                    {
                        action: 'clearfilters',
                        iconCls: 'limpiar',
                        tooltip: this.etiquetas.qtipCleanFilters,
                        allwaysEnabled: true,
                        keyMap: {
                            key: 'l',
                            alt: true,
                            ctrl: true,
                            event: 'click'
                        }
                    }
                ]
            }
        ];

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'add',
            iconCls: 'adicionar',
            text: this.etiquetas.lbBtnAdd,
            tooltip: this.etiquetas.qtipAdd.get(this.etiquetas.lbCompartimentacion),
            keyMap: {
                key: 'i',
                alt: true,
                event: 'click'
            }
        });


        this.btnEdit = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'edit',
            disabled: true,
            text: this.etiquetas.lbBtnMod,
            tooltip: this.etiquetas.qtipMod.get(this.etiquetas.lbCompartimentacion),
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });

        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: this.etiquetas.lbBtnDel,
            tooltip: this.etiquetas.qtipDel.get(this.etiquetas.lbCompartimentacion),
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            tooltip: this.etiquetas.qtipHelp,
            refhelp: ''
        });


        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                this.btnAdd,
                this.btnEdit,
                this.btnDel
            ]
        });

        this.callParent();
    }
});
