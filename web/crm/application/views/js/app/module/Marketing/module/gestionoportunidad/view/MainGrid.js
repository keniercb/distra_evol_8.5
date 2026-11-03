Ext.define('GestionOportunidad.view.MainGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.oportunidadgrid',
    region: 'center',
    selType: 'checkboxmodel',
    stripeRows: true,
    multiSelect: true,

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;

        me.store = Ext.create('GestionOportunidad.store.Oportunidad');
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;
        this.border = false;
        this.features = [{
            ftype: 'filters',
            menuFilterText: me.etiquetas.lbbusqueda,
            local: false
        }];

        var lbOportunidad = this.etiquetas.lbOportinidad;

        //COLUMNAS
        this.columns = [
            {
                text: me.etiquetas.lbNombre,
                dataIndex: 'denominacion',
                width: 170,
                filter: {
                    type: 'string'
                }
            }, {
                text: me.etiquetas.lbTipo,
                minWidth: 100,
                flex: 1,
                dataIndex: 'denomtipo',
                filter: {
                    type: 'string'
                }
            }, {
                text: me.etiquetas.lbCampannaAsociada,
                minWidth: 100,
                flex: 1,
                dataIndex: 'denomcampanna',
                filter: {
                    type: 'string'
                }
            }, {
                text: me.etiquetas.lbCanal,
                minWidth: 100,
                flex: 1,
                dataIndex: 'denomcanal',
                filter: {
                    type: 'string'
                }
            },
            {
                text: me.etiquetas.lbFecha,
                minWidth: 100,
                flex: 1,
                dataIndex: 'fecha',
                filter: {
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            }, {
                text: me.etiquetas.lbPrioridad,
                minWidth: 100,
                flex: 1,
                dataIndex: 'denomprioridad',
                filter: {
                    type: 'string'
                }
            }
        ];

        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                pageNumb: true,
                dock: 'bottom',
                displayInfo: true,
                items: [
                    {
                        action: 'clearfilters',
                        iconCls: 'limpiar',
                        tooltip: me.etiquetas.qtipCleanFilters,
                        allwaysEnabled:true,
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


        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            searchTooltip: this.etiquetas.qotipSearch,
            keyMap: [
                {
                    key: 'l',
                    alt: true,
                    ctrl: false,
                    event: 'onclick1'
                },
                {
                    key: 'b',
                    alt: true,
                    event: 'onclick2'
                }
            ]
        });

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'add',
            iconCls: 'adicionar',
            text: this.etiquetas.lbBtnAdd,
            tooltip: me.etiquetas.qotipAdd,
            oportunidad:true,
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
            text: this.etiquetas.lbModificar,
            tooltip: this.etiquetas.qotipMod,
            oportunidad:true,
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
            text: this.etiquetas.lbEliminar,
            tooltip: this.etiquetas.qotipDel,
            oportunidad:true,
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            tooltip: this.etiquetas.qotipHelp,
            refhelp:'dat_oportunidad'
        });

        this.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: true,
            items: [
                this.btnAdd,
                this.btnEdit,
                this.btnDel,
                '->',
                this.searchfield,
                '-',
                this.btnHelp
            ]
        });
        this.callParent();
    }


});
