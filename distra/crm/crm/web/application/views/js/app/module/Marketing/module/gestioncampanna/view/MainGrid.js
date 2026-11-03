//Esto es para porner un panel con una página inicia
Ext.define('GestionCampanna.view.MainGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.campannagrid',
    region: 'center',
    selType: 'checkboxmodel',
    stripeRows: true,
    multiSelect: true,

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;
        me.store = Ext.create('GestionCampanna.store.Campanna');
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;
        this.border = false;
        this.features = [{
            ftype: 'filters',
            menuFilterText: me.etiquetas.lbbusqueda,
            local: false
        }];
        var lbCampanna = this.etiquetas.lbCampanna;

        //COLUMNAS
        this.columns = [
            {
                text: me.etiquetas.lbNombre,
                sortable: false,
                dataIndex: 'denominacion',
                width: 270,
                filter: {
                    type: 'string'
                }
            }, {
                text: me.etiquetas.lbCodigo,
                sortable: true,
                flex: 1,
                dataIndex: 'codigo',
                filter: {
                    type: 'string'
                }
            }, {
                text: me.etiquetas.lbprioridad,
                sortable: true,
                flex: 1,
                dataIndex: 'denomprioridad',
                filter: {
                    type: 'string'
                }
            },
            {
                text: me.etiquetas.clFechaInicio,
                sortable: true,
                align: 'center',
                width: 150,
                dataIndex: 'fechainicio',
                filter: {
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.clFechaFin,
                sortable: true,
                align: 'center',
                width: 150,
                dataIndex: 'fechafin',
                filter: {
                    type: 'date',
                    beforeText: me.etiquetas.lbantes,
                    afterText: me.etiquetas.lbdespues,
                    onText: me.etiquetas.lbigual
                }
            },
            {
                text: me.etiquetas.lbCostoFijo,
                sortable: true,
                flex: 1,
                dataIndex: 'costofijo',
                filter: {
                    type: 'numeric'
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
            searchTooltip: this.etiquetas.qtipSearch.get(lbCampanna.toLowerCase()),
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
            tooltip: this.etiquetas.qotipAdd,
            campanna: true,
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
            campanna: true,
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
            campanna: true,
            nombre: 'campannagrid',
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnHelp = Ext.create('Ext.Button', {
            iconCls: 'ayuda',
            action: 'help',
            text: this.etiquetas.lbBtnhelp,
            tooltip: this.etiquetas.qtipHistoric,
            context: 'campanna',
            refhelp:'dat_campanna'
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
