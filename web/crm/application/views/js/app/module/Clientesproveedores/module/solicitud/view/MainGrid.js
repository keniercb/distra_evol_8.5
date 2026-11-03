Ext.define('Solicitud.view.MainGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.scp_maingrid',
    region: 'center',
    selType: 'checkboxmodel',
    stripeRows: true,
    multiSelect: true,

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        this.emptyText = this.etiquetas.msgNoDataLoaded;

        this.store = Ext.create('Solicitud.store.Solicitud');
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
                text: this.etiquetas.lbNombre,
                dataIndex: 'nombre',
                width: 200,
                filter: {
                    type: 'string'
                }
            }, {
                text: this.etiquetas.lbDireccion,
                minWidth: 100,
                flex: 1,
                dataIndex: 'direccion',
                filter: {
                    type: 'string'
                }
            }, {
                text: this.etiquetas.lbPais,
                minWidth: 100,
                flex: 1,
                dataIndex: 'nombredpapais',
                filter: {
                    type: 'string'
                }
            }, {
                text: this.etiquetas.lbCiudad,
                minWidth: 100,
                flex: 1,
                dataIndex: 'nombredpaciudad',
                filter: {
                    type: 'string'
                }
            },
            {
                text: this.etiquetas.lbCodigoPostal,
                minWidth: 100,
                flex: 1,
                dataIndex: 'codigopostal',
                filter: {
                    type: 'string'
                }
            }, {
                text: this.etiquetas.lbTelefono,
                minWidth: 100,
                flex: 1,
                dataIndex: 'telefono',
                filter: {
                    type: 'string'
                }
            }, {
                text: this.etiquetas.lbCorreo,
                minWidth: 100,
                flex: 1,
                dataIndex: 'correo',
                filter: {
                    type: 'string'
                }
            }, {
                text: this.etiquetas.lbEstado,
                width: 80,
                dataIndex: 'estado',
                filter: {
                    type: 'boolean',
                    yesText: me.etiquetas.lbBtnAprobado,
                    noText: me.etiquetas.lbBtnRechazado
                },
                renderer: this.setIcon
            }
        ];

        this.dockedItems = [
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


        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            searchTooltip: this.etiquetas.qtipSearch,
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
            tooltip: me.etiquetas.qtipAdd,
            disabled: true,
            hidden: true,
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
            tooltip: this.etiquetas.qtipMod,
            hidden: true,
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
            hidden: true,
            text: this.etiquetas.lbEliminar,
            tooltip: this.etiquetas.qtipDel,
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.btnDetalles = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detail',
            text: this.etiquetas.lbBtnDetalles,
            tooltip: this.etiquetas.lbBtnDetalles,
            disabled: true,
            keyMap: {
                key: 'd',
                alt: true,
                event: 'click'
            }
        });

        this.btnAprobar = Ext.create('Ext.menu.Item', {
            iconCls: 'aprobar verde',
            action: 'acept',
            text: this.etiquetas.lbBtnAprobado,
            tooltip: this.etiquetas.lbBtnAprobado,
            value: 1
        });

        this.btnRechazar = Ext.create('Ext.menu.Item', {
            iconCls: 'desaprobar rojo',
            action: 'deny',
            text: this.etiquetas.lbBtnRechazado,
            tooltip: this.etiquetas.lbBtnRechazado,
            value: 2
        });

        this.btnCambiarEstado = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            text: this.etiquetas.lbCambiarEstado,
            tooltip: this.etiquetas.lbCambiarEstado,
            disabled: true,
            menu: [me.btnAprobar, me.btnRechazar]
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
                this.btnDel,
                this.btnDetalles,
                this.btnCambiarEstado,
                '->',
                this.searchfield,
                '-',
                this.btnHelp
            ]
        });
        this.callParent();
    },

    setIcon: function (value, metaData) {
        var img = "",
            text = null;
        if (value == 1) {
            img = "aprobar verde";
            text = this.etiquetas.lbBtnAprobado;
        }
        if (value == 2) {
            img = "desaprobar rojo";
            text = this.etiquetas.lbBtnRechazado;
        }
        metaData.innerCls = "icondistra-" + img;
        metaData.tdAttr = 'data-qtip="' + text + '"';
        metaData.align = "center";
    }
});
