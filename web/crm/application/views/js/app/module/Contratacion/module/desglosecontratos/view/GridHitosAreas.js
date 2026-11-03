Ext.define('DesgloseContrato.view.GridHitosAreas', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dc_gridhitoarea',
    // selType: 'checkboxmodel',
    autoScroll: true,
    selType: 'rowmodel',
    editGrid: false,
    summaryColumnas: false,
    idsAreas:[],
    idStore: 'dc_stHitoArea',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
//         me.selModel = {mode: 'MULTI'};
        me.frame = false;
        me.border = false;
        me.title = me.etiquetas.lbDesgloseGeneral;
       // me.emptyText=me.etiquetas.lbEmptyHitosAreas;

        me.viewConfig = {
            markDirty: false
        };
        me.store = Ext.create('Ext.data.Store', {
            storeId: me.idStore,
            remoteFilter: true,
            onlyOneLoad: true,
            // remoteSort: true,
            // remoteGroup: true,
            sorters:[{property: 'porciento', direction: 'DESC'}],
            fields: [
                'denominacion', 'idarea', 'idhitoareaimplicada',
                {name: 'porciento', type: 'float'},
                {name: 'monto', type: 'float'},
                'idlineanegocio', 'lineanegocio',
                'producto', 'idproducto',
                'servicio', 'idservicio', 'idindicadorhito'
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarHitosAreas'}, ModuleMgr.get('DesgloseContrato')),
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            },
            editado: true
        });

//         if(me.summaryColumnas) {
            me.features=[
                {
                    ftype: 'summary',
//                     dock: 'top'
                }
            ];
//         }
        if(me.editGrid)
            me.plugins=
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 1,
                    listeners:{
                        edit:function(yo, obj){
                            me.store.editado=true;
                            // console.log(obj)
                            // if(ogj.field=='lineanegocio'){
                            //     obj.record.set('idlineanegocio', me.down('#celllineanegocio'))
                            // }
                        }
                    }
                })

        me.columns = [
            {
                text: me.etiquetas.lbNombre,
                tooltip: me.etiquetas.lbNombre,
                minWidth: 60,
                flex:1,
                dataIndex: 'denominacion',
                groupable: false,
                filter: {
                    type: 'string'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
                summaryType: 'count',
                summaryRenderer: function (value, summaryData, dataIndex) {
                    return '<b>'+value + ' área'+(value==1?'':'s')+'</b>';
                }
            },
            {
                text: me.etiquetas.lbPorciento,
                tooltip: me.etiquetas.lbPorciento,
                minWidth: 50,
                width: 70,
                dataIndex: 'porciento',
                align: 'right',
                groupable: false,
                // hidden:true,
                // hideable: false,
                filter: {
                    type: 'numeric'
                },
                // editor: {
                //     xtype: 'numberfield',
                //     allowBlank: false,
                //     minValue: 0,
                //     maxValue: 100,
                //
                //     maxLength: 5,
                //     decimalSeparator: '.',
                //     allowDecimals:true,
                //     allowExponential:false,
                //     step: 10,
                // },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + me.formatNumber(value) + '%'+(me.editGrid?'<br><i>Click para modificar</i>':'')+'"';
                    }
                    return me.formatNumber(value) + '%';
                },
                summaryType: function(records, dataindex){
                    var total = 0;
                    records.forEach(function (x) {
                        if (x.get(dataindex))
                            total += parseFloat(x.get(dataindex));
                    });
                    return parseFloat(total.toFixed(2));
                },
                summaryRenderer: function (value, summaryData, dataIndex) {
                    if(me.summaryColumnas)
                        return '<b style="color:'+(/^100(,00)?$/.test(value)?'green':'red')+'">'+me.formatNumber(value) + '%</b>';
                }
            },
            {
                text: me.etiquetas.lbMonto,
                tooltip: me.etiquetas.lbMonto,
                minWidth: 70,
                width: 90,
                dataIndex: 'monto',
                groupable: false,
                align: 'right',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 2,
                    decimalSeparator: '.',
                    allowDecimals:true,
                    allowExponential:false,
                },
                filter: {
                    type: 'numeric'
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + Ext.util.Format.number(value, '0.000,00/i') +(me.editGrid?'<br><i>Click para modificar</i>':'')+ '"';
                    }
                    return Ext.util.Format.number(value, '0.000,00/i');
                },
                summaryType: 'sum',
                summaryRenderer: function (value, summaryData, dataIndex) {
                    //console.log('que',value, me.montototal, value.toFixed(2), parseFloat(me.montototal).toFixed(2))
                    return '<b style="color:'+(value.toFixed(2)==parseFloat(me.montototal).toFixed(2)?'green':'red')+'">'+Ext.util.Format.number(value, '0.000,00/i')+'</b>';
                }
            },
            {
                text: 'Servicio',
                dataIndex: 'servicio',
                flex:1,
                editor:{
                    xtype: 'combo',
                    displayField:'denominacion',
                    valueField: 'denominacion',
                    pageSize: 20,
                    mode: 'remote',
                    queryParam: 'denominacion',
                    allowBlank:false,
                    closeAction: 'destroy',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'idindicador', type: 'int'},
                            {name: 'denominacion', type: 'string'},
                            {name: 'tipo', type: 'int'},
                            {name: 'codigoproveedor'}
                        ],
                        remoteSort: true,
                        pageSize: 20,
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContrato')),
                            actionMethods: {
                                read: 'POST'
                            },
                            extraParams: {
                                idtipoprecio: -1, tipo: 2
                            },
                            reader: {
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            }
                        }
                    }),
                    listeners:{
                        select: function(yo, records){
                            me.getSelectionModel().getLastSelected().set('idservicio', records[0].get('idindicador'));
                        }
                    }
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            },
            {
                text: 'Linea de negocio',
                dataIndex: 'lineanegocio',
                flex:1,
                editor:{
                    xtype: 'combo',
                    displayField:'denominacion',
                    valueField: 'denominacion',
                    pageSize: 20,
                    mode: 'remote',
                    queryParam: 'denominacion',
                    // allowBlank:false,
                    closeAction: 'destroy',
                    store: Ext.create('Ext.data.Store',{
                        fields:['idnaturaleza', 'denominacion'],
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'cargarNaturalezas'}, ModuleMgr.get('GestionContrato')),
                            actionMethods: {
                                read: 'POST'
                            },
                            reader: {
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            }
                        },
                        pageSize: 20
                    }),
                    listeners:{
                        select: function(yo, records){
                            var select=me.getSelectionModel().getLastSelected();
                            select.set('idlineanegocio', records[0].get('idnaturaleza'));
                            var start=false;
                            if(!me.down('#cellproducto').field) {
                                start=me.getPlugin().startEdit(select, me.down('#cellproducto'))
                                me.getPlugin().cancelEdit();
                            }
                            if(me.down('#cellproducto').field) {
                                me.down('#cellproducto').field.reset();
                                me.down('#cellproducto').field.getStore().proxy.extraParams.idnaturaleza = records[0].get('idnaturaleza');
                                me.down('#cellproducto').field.getStore().load();
                            }
                            select.set('producto', null);
                            select.set('idproducto', null);
                            // me.down('#cellproducto').field.getStore().load()
                        },
                        change: function(yo){
                            if(!yo.getValue()){
                                // me.down('#cellproducto').field.setDisabled(true);
                                var select=me.getSelectionModel().getLastSelected();
                                select.set('lineanegocio', null);
                                select.set('idlineanegocio', null);
                                if(!me.down('#cellproducto').field) {
                                    start=me.getPlugin().startEdit(select, me.down('#cellproducto'))
                                    me.getPlugin().cancelEdit();
                                }
                                if(me.down('#cellproducto').field) {
                                    me.down('#cellproducto').field.reset();
                                    delete me.down('#cellproducto').field.getStore().proxy.extraParams.idnaturaleza;
                                    me.down('#cellproducto').field.getStore().removeAll();
                                }
                            }
                        }
                    }
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            },
            {
                text: 'Producto',
                dataIndex: 'producto',
                itemId: 'cellproducto',
                flex:1,
                editor:{
                    xtype: 'combo',
                    // disabled:true,
                    displayField:'denominacion',
                    valueField: 'denominacion',
                    pageSize: 20,
                    mode: 'remote',
                    queryParam: 'denominacion',
                    // allowBlank:false,
                    closeAction: 'destroy',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'idindicador', type: 'int'},
                            {name: 'denominacion', type: 'string'},
                            {name: 'tipo', type: 'int'},
                            {name: 'codigoproveedor'}
                        ],
                        // remoteSort: true,
                        pageSize: 20,
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContrato')),
                            actionMethods: {
                                read: 'POST'
                            },
                            extraParams: {
                                idtipoprecio: -1, tipo: 1
                            },
                            reader: {
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            }
                        }
                    }),
                    listeners:{
                        render: function(yo){
                            yo.getStore().proxy.extraParams.tipo=1;
                            var select=me.getSelectionModel().getLastSelected();
                            if(select && select.get('idlineanegocio'))
                                yo.getStore().proxy.extraParams.idnaturaleza=select.get('idlineanegocio');
                            // yo.getStore().load();
                        },
                        select: function(yo, records){
                            me.getSelectionModel().getLastSelected().set('idproducto', records[0].get('idindicador'));
                        }
                    }
                },
                renderer: function (value, meta) {
                    if (value) {
                        meta.tdAttr = 'data-qtip="' + value + '"';
                    }
                    return value;
                },
            }
        ];
        me.callParent();
        if(me.editGrid){
            me.getStore().on('load', function(yo, records, success){
                if(success){
                    records.forEach(function(x){
                        start=me.plugins[0].startEdit(x, me.down('#cellproducto'));
                        if(x.get('idlineanegocio')){
                            me.down('#cellproducto').field.setDisabled(false);
                            me.down('#cellproducto').field.getStore().proxy.extraParams.idnaturaleza=x.get('idlineanegocio');
                        }
                    })
                    me.plugins[0].cancelEdit();
                }
            })
        }

        // me.plugins[0]
        // me.down('#cellproducto').editor.render();
    },
    findState: function (idestado) {
        var estados = this.getStore().proxy.reader.jsonData.estados;
        return estados[idestado];
    },
    onSerialize: function (data, filter, eOpts) {
        data['value'] = Ext.encode(data['value']);
    },
    formatNumber: function(value){
        if(Math.round(value)!=value)
            return Ext.util.Format.number(value, '0.000,00/i');
        return value;
    }

});
