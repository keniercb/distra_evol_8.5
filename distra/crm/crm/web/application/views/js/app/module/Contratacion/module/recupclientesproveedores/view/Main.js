Ext.define('RecupClientesProveedores.view.Main', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.recupclientesproveedores_view',
    border: false,
    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);

        me.store = Ext.create('RecupClientesProveedores.store.ClientesProveedores');

        me.columns = [
            {
                text: me.etiquetas.lbCodigoREES,
                sortable: false,
                align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'codigo'
            },{
                text: me.etiquetas.lbNombre,
                sortable: false,
                flex: 1,
                dataIndex: 'nombre'
            },{
                text: me.etiquetas.lbAbreviatura,
                sortable: false,
                align: 'center',
                fixed: true,
                width: 100,
                dataIndex: 'abreviatura'
            },{
                text: me.etiquetas.lbClasifcacion,
                sortable: false,
                align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'idclasificacion',
                renderer: function (value, meta, record) {
                    var tipo, clasificacion, img;

                    switch(record.get('idtipo')){
                        case '1': tipo = 'cliente';break;
                        case '2': tipo = 'proveedor';break;
                        case '3': tipo = 'cliente-proveedor';break;
                    }

                    switch(value){
                        case '1': clasificacion = 'entidad';break;
                        case '2': clasificacion = 'persona';break;
                    }

                    img = '/configuracion/comun/views/images/'+clasificacion + '_'+ tipo + '_min.png';

                    return "<img src ='"+img+"'>";
                }
            },{
                text: me.etiquetas.lbContratos,
                sortable: false,
                align: 'center',
                fixed: true,
                width: 80,
                dataIndex: 'cantcontratos'
            },
			// {
                // text: me.etiquetas.lbSolicitud,
                // sortable: false,
                // align: 'center',
                // fixed: true,
                // width: 80,
                // dataIndex: 'solicitud'
            // }
        ];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: this.getTbarBtns()
        },{
            xtype: 'form',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                margin: '10px 0 10px 10px'
            },
            bodyStyle: {
                background: '#d3e1f1',
                border: '1px 0px 0px 0px',
            },
            layout: 'hbox',
            dock: 'top',
            items: this.getTbarFiltros()
        },{
                xtype: 'pagingtoolbar',
                itemId: 'pagingtb',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
        }];

        me.callParent();
    },
    getTbarBtns: function(){
        var me = this;

        return [
            {
                text: me.etiquetas.lbBtnVerDetalles,
                iconCls: 'icondistra-detalles',
                tooltip: me.etiquetas.ttipBtnVerDetalles,
                action: 'verdetalles',
                disabled: true
            },{
                text: me.etiquetas.lbBtnGenerarReporte,
                iconCls: 'icondistra-generadorreportes',
                tooltip: me.etiquetas.ttipBtnGenerarReporte,
                action: 'generarreporte'
            },{
                text: me.etiquetas.lbBtnFiltros,
                iconCls: 'icondistra-filtrar',
                tooltip: me.etiquetas.ttipBtnFiltros,
                action: 'filtros',

            }
            ,{
                text: me.etiquetas.lbBtnBusquedaAvanzada,
                iconCls: 'icondistra-buscaravanzada',
                tooltip: me.etiquetas.ttipBtnBusquedaAvanzada,
                action: 'busquedaavanzada',
            }
            ,'->',{
                iconCls: 'ayuda',
                action: 'help',
                text: me.etiquetas.lbBtnhelp,
                // refhelp: 'dat_contrato',
                tooltip: me.etiquetas.qtipHelp
            }
        ];
    },
    getTbarFiltros: function(){
        var me = this;
        
        var storeClasificacion = Ext.create('Ext.data.ArrayStore',{
            fields: ['clasificacion', 'denominacion'],
            data : [
                [1, me.etiquetas.lbCliente],
                [2, me.etiquetas.lbProveedor]
            ]
        });

        return [
            {
                xtype: 'combobox',
                fieldLabel: me.etiquetas.lbClasificacion,
                width: 100,
                store: storeClasificacion,
                valueField: 'clasificacion',
                displayField: 'denominacion',
                hiddenName: 'clasificacion',
                triggerAction: 'all',
                name: 'idtipo',
                mode: 'local',
                emptyText: me.etiquetas.lbEmptyText,
            },{
                xtype: 'textfield',
                fieldLabel: me.etiquetas.lbCodigoREES,
                name: 'codigo',
                width: 70,
            },{
                xtype: 'textfield',
                name: 'nombre',
                fieldLabel: me.etiquetas.lbNombre,
            },{
                xtype: 'textfield',
                fieldLabel: me.etiquetas.lbAbreviatura,
                name: 'abreviatura',
                width: 70,
            },
            Ext.create('Ext.form.field.Hidden', {
                context: 'gestioncontratomainwindowsector',
                name: 'idsector',
                itemId:'idsector'
            }),
            Ext.create('Ext.ux.CmbSelectField', {
                fieldLabel: me.etiquetas.lbSector,
                // fieldLabel: me.context == "proveedor" ? me.etiquetas.lbOrganismo:me.etiquetas.lbEsquema,
                name: 'sector',
                mapping: 'NomSector.denominacion',
                localId: 'idsector',
                module: 'Nomencladores',
                // allowBlank: false,
                gen: 'm',
                filters: {},
                //disabled: true,
                context: 'gestioncontratomainwindowsector',
                listeners:{
                    select: function(yo, records){
                        me.down('#idsector').setValue(records[0].data['idsector']);
                    },
                    change: function(yo, value){
                        if(Ext.isEmpty(value)){
                            me.down('#idsector').setValue('');
                        }
                    }
                }
            }),
            {
                xtype: 'button',
                iconCls: 'icondistra-buscar',
                tooltip: me.etiquetas.qtipBuscar,
                text: me.etiquetas.lbBtnBuscar,
                margin: '27 0 0 10',
                action: 'buscarform'
            },{
                xtype: 'button',
                iconCls: 'icondistra-limpiar',
                tooltip: me.etiquetas.ttipBtnLimpiar,
                text: me.etiquetas.lbBtnLimpiar,
                margin: '27 0 0 5',
                action: 'limpiarform'
            }
        ];
    }
});
