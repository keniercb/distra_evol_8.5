Ext.define('ProgramaMedico.view.PanelPrincipal', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.programamedicoprincipal',
    closable: true,
    requires: [
        'Ext.ux.grid.FiltersFeature'
    ],
    module: 'ProgramaMedico',//'Oferta',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(this);
        this.title = me.etiquetas.moduleName;

        me.selType='checkboxmodel';

        me.store=Ext.create('ProgramaMedico.store.ProgramaMedico');
        me.store.load();

        function mostrarTooltipColumna(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }
        function formatoDinero(value, meta) {
            if (value)
                meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') + '"';
            return Ext.util.Format.number(value, '0.000,00/i');
        }
        function onSerialize(data, filter, eOpts) {
            data['value'] = Ext.encode(data['value']);
        }

        me.columns=[
            {
                text: 'Número',
                fixed: true,
                width: 90,
                dataIndex: 'numero',
                filter:{type: 'string'},
                renderer: mostrarTooltipColumna
            },{
                text: 'Nombre',
                flex: 1,
                minWidth:150,
                dataIndex: 'nombre',
                filter:{type: 'string'},
                renderer: mostrarTooltipColumna
            },{
                text: 'Paciente',
                flex: 1,
                minWidth:100,
                dataIndex: 'paciente',
                filter:{type: 'string'},
                renderer: mostrarTooltipColumna
            },{
                text: 'Fecha solicitud',
                width: 100,
                minWidth:100,
                dataIndex: 'fechasolicitud',
                filter:{type: 'date'},
                renderer: mostrarTooltipColumna
            },{
                text: 'Fecha entrada',
                width: 100,
                minWidth:100,
                dataIndex: 'fechaentrada',
                filter:{type: 'date'},
                renderer: mostrarTooltipColumna
            },{
                text: 'Monto total',
                sortable: false,
                align: 'right',
                width: 90,
                minWidth:60,
                dataIndex: 'montototal',
                filter:{type: 'numeric'},
                renderer: formatoDinero
            },
            {
                text: 'Estado',
                minWidth: 80,
                width: 100,
                dataIndex: 'estado',
                renderer: function (value, meta, record) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    meta.tdAttr = 'data-qtip="' + value + ' <br><u>Fecha</u>: ' + record.data.fechaestado + '"';
                    return value;
                },
                filter: {
                    type: 'list',
                    idField: 'idestado',
                    labelField: 'nombre',
                    store: Ext.create('Ext.data.Store', {
                        autoLoad: false,
                        proxy: {
                            extraParams: {
                                columnlist: 'ne.nombre, ne.idestado'
                            },
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'filterliststore'}, ModuleMgr.get('GestionContratoImportacion'))
                        },
                        fields: [
                            {name: 'nombre', type: 'string'},
                            {name: 'idestado', type: 'integer'},
                        ]
                    }),
                    listeners: {
                        serialize: me.onSerialize
                    }
                }
            }
        ];

        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items:[
                    {
                        xtype:'button',
                        text: me.etiquetas.lbBtnAdd,
                        itemId:'addprogramamedico',
                        iconCls: 'icondistra-adicionar',
                        tooltip: 'Adicionar programa médico',
                        action: 'addprogramamedico',
                        selector:'adicionarProgramaMedico',
                        // hidden:true,
                        keyMap: {
                            key: 'a',
                            alt: true,
                            ctrl: false,
                            event: 'click'
                        }
                    },
                    {
                        xtype:'button',
                        text: me.etiquetas.lbBtnMod,
                        itemId:'modprogramamedico',
                        iconCls: 'icondistra-modificar',
                        tooltip: 'Modificar programa médico',
                        action: 'modprogramamedico',
                        disabled: true,
                        selector:'modificarProgramaMedico',
                        // hidden:true,
                        keyMap: {
                            key: 'm',
                            alt: true,
                            ctrl: false,
                            event: 'click'
                        }
                    },
                    {
                        xtype:'button',
                        text: me.etiquetas.lbBtnDel,
                        itemId:'elimprogramamedico',
                        iconCls: 'icondistra-eliminar',
                        tooltip: 'Eliminar programa médico',
                        action: 'elimprogramamedico',
                        disabled: true,
                        selector:'eliminarProgramaMedico',
                        // hidden:true,
                        keyMap: {
                            ctrl:false,
                            alt:false,
                            key: Ext.EventObject.DELETE,
                            event: 'click'
                        }
                    },
                    {
                        text: 'Cambiar estado',
                        itemId: 'cambiarestadoprogramamedico',
                        iconCls: 'modificar',
                        tooltip: 'Canbiar estado',
                        disabled: true,
                        action: 'cambiarestadoprogramamedico',
                        menu: new Ext.menu.Menu()
                    },
                    {
                        text: 'Facturar',
                        itemId: 'facturarprogramamedico',
                        iconCls: 'facturar',
                        tooltip: 'Facturar servicios de programa medico',
                        disabled: true,
                        action: 'facturarprogramamedico',
                        keyMap: {
                            ctrl:false,
                            alt:true,
                            key: 'f',
                            event: 'click'
                        }
                    },
                    {
                        xtype:'button',
                        text: 'Exportar',
                        itemId:'exportarprogramamedico',
                        iconCls: 'icondistra-exportar',
                        tooltip: 'Exportar programa médico',
                        action: 'exportarprogramamedico',
                        disabled: true,
                        selector:'exportarProgramaMedico',
                        // hidden:true,
                        keyMap: {
                            ctrl:false,
                            alt:true,
                            key: 'e',
                            event: 'click'
                        }
                    },
                ]
            },
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true,
                // leyenda:[
                //     {text: 'Oferta'},
                //     {text: 'Reoferta', class: 'reoferta'},
                // ],
                items: [
                    {
                        action: 'clearfilters',
                        iconCls: 'limpiar',
                        tooltip: 'Limpiar filtros',
                        allwaysEnabled: true,
                        keyMap: {
                            key: 'l',
                            alt: true,
                            ctrl: true,
                            shift: false,
                            event: 'click'
                        }
                    }
                ]
            },
        ]


        me.callParent();
    },
    onSerialize: function (data, filter, eOpts) {
        data['value'] = Ext.encode(data['value']);
    }
})