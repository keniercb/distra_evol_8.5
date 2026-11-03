/*reportesuam.js
 * Vista para visualizar los reportes de la UAM
 * @author: Damian Oscar Falcon Borras
 * @package: Plataforma Integral de Planificacion
 * @subpackage: Planificacion de Producciones
 * @copyright: SPO-UAM
 * @version: 1.0.0
 */

var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = {};
//***************variables****************
f = new Date();
var identidadselected, is_leaf, area, identrotacion, identetapa, identprod, identarea, identapro,
        annoEtapa = f.getFullYear(), annoProduccion = f.getFullYear(), annoAprovechamiento = f.getFullYear();
objci = {};
objci.acciones = [];
/*cargarInterfaz();
 function cargarInterfaz(){*/
Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.create('Ext.data.Store', {
        storeId: 'rotacionStore',
        pageSize: 20,
        fields: ['idaplicacioncartatec', 'codigo', 'denominacion', 'fecha_inicio_pre_tierra', 'fecha_fin_pre_tierra', 'fecha_inicio_siembra',
            'fecha_fin_siembra', 'fecha_inicio_cosecha', 'fecha_fin_cosecha', 'denentidad'],
        proxy: {
            url: 'listarPlanRotacionCultivo',
            type: 'ajax',
            actionMethods: 'POST',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        },
        listeners: {
            beforeload: function (th) {
                identrotacion = identidadselected;
                th.proxy.extraParams.fechainicio = Ext.getCmp('dffechainicio') != undefined ? formatDate(Ext.getCmp('dffechainicio').getValue()) : null;
                th.proxy.extraParams.fechafin = Ext.getCmp('dffechafin') != undefined ? formatDate(Ext.getCmp('dffechafin').getValue()) : null;
                th.proxy.extraParams.identidad = identidadselected;
                th.proxy.extraParams.is_leaf = is_leaf;
            },
            load: function (th) {
                if (is_leaf)
                    Ext.getCmp('gpPlanSiembraRotacion').getView().getHeaderAtIndex(0).hide();
                else
                    Ext.getCmp('gpPlanSiembraRotacion').getView().getHeaderAtIndex(0).show();
            }
        }
    });

    Ext.define('ProduccionStore', {
        extend: 'Ext.data.Model',
        idProperty: 'IdProduccionStore',
        fields: [{
                name: 'idindicador',
                //mapping: 'DatCartatecnologica.DatCartatecnologicaindicador.idindicador',
                type: 'string'
            }, {
                name: 'denominacion',
                //mapping: 'DatCartatecnologica.DatCartatecnologicaindicador.NomIndicador.denominacion',
                type: 'string'
            }, {
                name: 'codigo',
                //mapping: 'DatCartatecnologica.DatCartatecnologicaindicador.NomIndicador.codigo',
                type: 'string'
            }, {
                name: 'denometapa',
                type: 'string'
            }, {
                name: 'denentidad',
                type: 'string'
            }, {
            }, {
                name: '01',
                type: 'int'
            }, {
                name: '02',
                type: 'int'
            }, {
                name: '03',
                type: 'int'
            }, {
                name: '04',
                type: 'int'
            }, {
                name: '05',
                type: 'int'
            }, {
                name: '06',
                type: 'int'
            }, {
                name: '07',
                type: 'int'
            }, {
                name: '08',
                type: 'int'
            }, {
                name: '09',
                type: 'int'
            }, {
                name: '10',
                type: 'int'
            }, {
                name: '11',
                type: 'int'
            }, {
                name: '12',
                type: 'int'
            }]
    });

    Ext.create('Ext.data.Store', {
        storeId: 'produccionStore',
        model: 'ProduccionStore',
        pageSize: 20,
        proxy: {
            url: 'listarPlanProduccion',
            type: 'ajax',
            actionMethods: 'POST',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        },
        listeners: {
            beforeload: function (th) {
                identprod = identidadselected;
                th.proxy.extraParams.identidad = identidadselected;
                th.proxy.extraParams.is_leaf = is_leaf;
                th.proxy.extraParams.anno = annoProduccion;
            }
        }
    });

    Ext.create('Ext.data.Store', {
        storeId: 'stactividadetapa',
        model: 'ProduccionStore',
        groupField: 'denometapa',
        proxy: {
            url: 'listarPlanProduccionporEtapa',
            type: 'ajax',
            actionMethods: 'POST',
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'total'
            }
        },
        listeners: {
            beforeload: function (th) {
                identetapa = identidadselected;
                th.proxy.extraParams.identidad = identidadselected;
                th.proxy.extraParams.is_leaf = is_leaf;
                th.proxy.extraParams.etapa = Ext.getCmp('cbetapa').getValue();
                th.proxy.extraParams.anno = annoEtapa;
            },
            load: function (th) {
                if (Ext.getCmp('cbetapa').getValue() == null) {
                    Ext.getCmp('gpActividadesEtapas').getView().getHeaderAtIndex(3).show();
                } else {
                    Ext.getCmp('gpActividadesEtapas').getView().getHeaderAtIndex(3).hide();
                }
                if (is_leaf)
                    Ext.getCmp('gpActividadesEtapas').getView().getHeaderAtIndex(0).hide();
                else
                    Ext.getCmp('gpActividadesEtapas').getView().getHeaderAtIndex(0).show();
            }
        }
    });

    Ext.create('Ext.data.Store', {
        storeId: 'stetapa',
        fields: ['denominacion', 'idetapa'],
        proxy: {
            url: 'listarEtapas',
            type: 'ajax',
            actionMethods: 'POST',
            reader: {
                type: 'json',
                root: 'data'
            }
        }
    });
    var store1 = Ext.create('Ext.data.Store', {
        storeId: 'stProductos',
        fields: ['area', 'denominacion'],
        proxy: {
            url: 'listarProductosporArea',
            type: 'ajax',
            actionMethods: 'POST',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        listeners: {
            beforeload: function (th) {
                identprod = identidadselected;
                th.proxy.extraParams.fechainicio = Ext.getCmp('dffechainicioProductos') != undefined ? formatDate(Ext.getCmp('dffechainicioProductos').getValue()) : null;
                th.proxy.extraParams.fechafin = Ext.getCmp('dffechafinProductos') != undefined ? formatDate(Ext.getCmp('dffechafinProductos').getValue()) : null;
                th.proxy.extraParams.identidad = identidadselected;
                th.proxy.extraParams.is_leaf = is_leaf;
                th.proxy.extraParams.areatotal = area;
            }
        }
    })

    var store2 = Ext.create('Ext.data.Store', {
        storeId: 'stAprovechamiento',
        fields: ['area', 'mes'],
        proxy: {
            url: 'listarAprovechamientoSuelos',
            type: 'ajax',
            actionMethods: 'POST',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        listeners: {
            beforeload: function (th) {
                th.proxy.extraParams.anno = annoAprovechamiento;
                identapro = identidadselected;
                th.proxy.extraParams.identidad = identidadselected;
                th.proxy.extraParams.is_leaf = is_leaf;
                th.proxy.extraParams.area = area;
            }
        }
    })

    var grid = Ext.create('Ext.grid.Panel', {
        id: 'gpPlanSiembraRotacion',
        tbar: ['<b>Fecha inicio: </b>'
                    , {
                        emptyText: 'Seleccione la fecha...',
                        xtype: 'datefield',
                        format: 'd/m/Y',
                        width: 150,
                        id: 'dffechainicio'
                    }, '-', '<b>Fecha fin: </b>'
                    , {
                        emptyText: 'Seleccione la fecha...',
                        xtype: 'datefield',
                        width: 150,
                        format: 'd/m/Y',
                        id: 'dffechafin'
                    }, '-', {
                icon: perfil.dirImg + 'buscar.png',
                iconCls: 'btn',
                tooltip: 'Buscar  <b>(Alt + B)</b>',
                text: 'Buscar',
                handler: function () {
                    Ext.getCmp('gpPlanSiembraRotacion').getStore().load();
                }
            }, '-', {
                text: 'Limpiar',
                tooltip: 'Limpiar filtro',
                icon: perfil.dirImg + 'limpiar.png',
                iconCls: 'btn',
                handler: function () {
                    Ext.getCmp('dffechainicio').setValue(null);
                    Ext.getCmp('dffechafin').setValue(null);
                    Ext.getCmp('gpPlanSiembraRotacion').getStore().load();
                }
            }],
        selType: 'rowmodel',
        viewConfig: {
            emptyText: '<b><center>No hay datos que mostrar</center></b>',
            loadingText: 'Cargando...',
            stripeRows: true
        },
        store: Ext.data.StoreManager.lookup('rotacionStore'),
        dockedItems: [{
                xtype: 'pagingtoolbar',
                store: Ext.data.StoreManager.lookup('rotacionStore'),
                dock: 'bottom',
                displayMsg: 'Mostrando {0} - {1} de {2}',
                beforePageText: 'P&aacute;gina',
                afterPageText: 'de {0}',
                emptyMsg: 'No hay datos que mostrar',
                displayInfo: true
            }],
        columns: [{
                header: 'Entidad',
                width: 120,
                dataIndex: 'denentidad',
                tooltip: 'Entidad ejecutora'
            }, {
                header: 'C&oacute;digo',
                dataIndex: 'codigo',
                width: 60,
                hidden: true
            }, {
                header: 'Producto',
                dataIndex: 'denominacion',
                flex: 1
            }, {
                header: 'Preparaci&oacute;n de tierra',
                dataIndex: 'fechapreparacion',
                width: 190,
                align: 'center',
                renderer: function (v, params, record) {
                    if (record.data.fecha_fin_pre_tierra != null && record.data.fecha_inicio_pre_tierra != null)
                        return record.data.fecha_inicio_pre_tierra.substring(8, 10) + '/' + record.data.fecha_inicio_pre_tierra.substring(5, 7) + '/' + record.data.fecha_inicio_pre_tierra.substring(0, 4) + '&nbsp;&nbsp; - &nbsp;&nbsp;' + record.data.fecha_fin_pre_tierra.substring(8, 10) + '/' + record.data.fecha_fin_pre_tierra.substring(5, 7) + '/' + record.data.fecha_fin_pre_tierra.substring(0, 4)
                    else
                        return 'Sin fecha'
                }
            }, {
                header: 'Siembra',
                width: 190,
                align: 'center',
                tooltip: 'Fecha de la siembra',
                renderer: function (v, params, record) {
                    if (record.data.fecha_inicio_siembra != null && record.data.fecha_fin_siembra != null)
                        return record.data.fecha_inicio_siembra.substring(8, 10) + '/' + record.data.fecha_inicio_siembra.substring(5, 7) + '/' + record.data.fecha_inicio_siembra.substring(0, 4) + '&nbsp;&nbsp; - &nbsp;&nbsp;' + record.data.fecha_fin_siembra.substring(8, 10) + '/' + record.data.fecha_fin_siembra.substring(5, 7) + '/' + record.data.fecha_fin_siembra.substring(0, 4)
                    else
                        return 'Sin fecha'
                }
            }, {
                header: 'Cosecha',
                width: 190,
                align: 'center',
                dataIndex: 'fechacosecha',
                tooltip: 'Fecha de la cosecha',
                renderer: function (v, params, record) {
                    if (record.data.fecha_inicio_cosecha != null && record.data.fecha_fin_cosecha != null)
                        return record.data.fecha_inicio_cosecha.substring(8, 10) + '/' + record.data.fecha_inicio_cosecha.substring(5, 7) + '/' + record.data.fecha_inicio_cosecha.substring(0, 4) + '&nbsp;&nbsp; - &nbsp;&nbsp;' + record.data.fecha_fin_cosecha.substring(8, 10) + '/' + record.data.fecha_fin_cosecha.substring(5, 7) + '/' + record.data.fecha_fin_cosecha.substring(0, 4)
                    else
                        return 'Sin fecha'
                }
            }]
    });

    var grid2 = Ext.create('Ext.grid.Panel', {
        id: 'gpPlanProduccion',
        viewConfig: {
            emptyText: '<b><center>No hay datos que mostrar</center></b>',
            loadingText: 'Cargando...',
            stripeRows: true
        },
        tbar: ['->', {
                tooltip: "Año anterior",
                disabled: false,
                icon: perfil.dirImg + 'anterior.png',
                iconCls: 'btn',
                handler: function () {
                    annoProduccion -= 1;
                    Ext.getCmp('tbAnnoProduccion').setText('<b>' + annoProduccion + '</b>');
                    Ext.data.StoreManager.lookup('produccionStore').load();
                }
            }, {
                xtype: 'tbtext',
                text: '<b>2012</b>',
                id: 'tbAnnoProduccion'
            }, {
                tooltip: "Año siguiente",
                disabled: false,
                icon: perfil.dirImg + 'siguiente.png',
                iconCls: 'btn',
                handler: function () {
                    annoProduccion += 1;
                    Ext.getCmp('tbAnnoProduccion').setText('<b>' + annoProduccion + '</b>');
                    Ext.data.StoreManager.lookup('produccionStore').load();
                }
            }, '->'],
        store: Ext.data.StoreManager.lookup('produccionStore'),
        columns: [{
                header: 'C&oacute;digo',
                dataIndex: 'codigo',
                hidden: true,
                width: 65,
                tooltip: 'C&oacute;digo del producto'
            }, {
                header: 'Producto',
                dataIndex: 'denominacion',
                minWidth: 80,
                flex: 1,
                tooltip: 'Denominaci&oacute;n del producto'
            }, {
                header: 'Enero',
                dataIndex: '01',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Enero'
            }, {
                header: 'Febrero',
                dataIndex: '02',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Febrero'
            }, {
                header: 'Marzo',
                dataIndex: '03',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Marzo'
            }, {
                header: 'Abril',
                dataIndex: '04',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Abril'
            }, {
                header: 'Mayo',
                dataIndex: '05',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Mayo'
            }, {
                header: 'Junio',
                dataIndex: '06',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Junio'
            }, {
                header: 'Julio',
                dataIndex: '07',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Julio'
            }, {
                header: 'Agosto',
                dataIndex: '08',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Agosto'
            }, {
                header: 'Septiembre',
                dataIndex: '09',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Septiembre'
            }, {
                header: 'Octubre',
                dataIndex: '10',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Octubre'
            }, {
                header: 'Noviembre',
                dataIndex: '11',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Noviembre'
            }, {
                header: 'Diciembre',
                dataIndex: '12',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Diciembre'
            }]
    });

    var grouping = Ext.create('Ext.grid.feature.Grouping', {
        groupHeaderTpl: '{name} ({rows.length} {[values.rows.length > 1 ? "Producciones" : "Producci&oacuten"]})'
    });

    var grid3 = Ext.create('Ext.grid.Panel', {
        id: 'gpActividadesEtapas',
        features: [grouping],
        tbar: ['<b>Etapa: </b>', {
                xtype: 'combo',
                id: 'cbetapa',
                emptyText: 'Seleccione la etapa...',
                store: 'stetapa',
                valueField: 'idetapa',
                displayField: 'denominacion',
                width: 150,
                typeAhead: true,
                triggerAction: 'all',
                listeners: {
                    select: function () {
                        Ext.getCmp('gpActividadesEtapas').getStore().load();
                    }
                }
            }, '-', {
                text: 'Limpiar',
                tooltip: 'Limpiar filtro',
                icon: perfil.dirImg + 'limpiar.png',
                iconCls: 'btn',
                handler: function () {
                    Ext.getCmp('cbetapa').setValue(null);
                    Ext.getCmp('gpActividadesEtapas').getStore().load();
                }
            }, '->', {
                tooltip: "Año anterior",
                disabled: false,
                icon: perfil.dirImg + 'anterior.png',
                iconCls: 'btn',
                handler: function () {
                    annoEtapa -= 1;
                    Ext.getCmp('tbAnnoEtapa').setText('<b>' + annoEtapa + '</b>');
                    Ext.data.StoreManager.lookup('stactividadetapa').load();
                }
            }, {
                xtype: 'tbtext',
                text: '<b>2012</b>',
                id: 'tbAnnoEtapa'
            }, {
                tooltip: "Año siguiente",
                disabled: false,
                icon: perfil.dirImg + 'siguiente.png',
                iconCls: 'btn',
                handler: function () {
                    annoEtapa += 1;
                    Ext.getCmp('tbAnnoEtapa').setText('<b>' + annoEtapa + '</b>');
                    Ext.data.StoreManager.lookup('stactividadetapa').load();
                }
            }, '->'],
        viewConfig: {
            emptyText: '<b><center>No hay datos que mostrar</center></b>',
            loadingText: 'Cargando...',
            stripeRows: true
        },
        store: Ext.data.StoreManager.lookup('stactividadetapa'),
        columns: [{
                header: 'Entidad',
                dataIndex: 'denentidad',
                minWidth: 80,
                tooltip: 'Denominaci&oacute;n de la entidad'
            }, {
                header: 'C&oacute;digo',
                dataIndex: 'codigo',
                hidden: true,
                width: 65,
                tooltip: 'C&oacute;digo del producto'
            }, {
                header: 'Producto',
                dataIndex: 'denominacion',
                minWidth: 80,
                flex: 1,
                tooltip: 'Denominaci&oacute;n del producto'
            }, {
                header: 'Etapa',
                dataIndex: 'denometapa',
                minWidth: 100,
                tooltip: 'Etapa de producci&oacute;n'
            }, {
                header: 'Enero',
                dataIndex: '01',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Enero'
            }, {
                header: 'Febrero',
                dataIndex: '02',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Febrero'
            }, {
                header: 'Marzo',
                dataIndex: '03',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Marzo'
            }, {
                header: 'Abril',
                dataIndex: '04',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Abril'
            }, {
                header: 'Mayo',
                dataIndex: '05',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Mayo'
            }, {
                header: 'Junio',
                dataIndex: '06',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Junio'
            }, {
                header: 'Julio',
                dataIndex: '07',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Julio'
            }, {
                header: 'Agosto',
                dataIndex: '08',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Agosto'
            }, {
                header: 'Septiembre',
                dataIndex: '09',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Septiembre'
            }, {
                header: 'Octubre',
                dataIndex: '10',
                width: 65,
                renderer: formatValor,
                tooltip: 'Volumen de producci&oacute;n en Octubre'
            }, {
                header: 'Noviembre',
                dataIndex: '11',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Noviembre'
            }, {
                header: 'Diciembre',
                dataIndex: '12',
                renderer: formatValor,
                width: 65,
                tooltip: 'Volumen de producci&oacute;n en Diciembre'
            }]
    });
    function formatValor(value) {
        if (value == null || parseInt(value) == 0 || value == "") {
            return '<span style="color:red;">' + '0.00' + '</span>';
        } else {
            return '<span style="color:green;">' + parseFloat(value).toFixed(2) + '</span>';
        }
    }
    ;
    function actualizarArbol(arbol) {
        if (arbol.selModel.lastSelected.data != undefined) {
            if (!arbol.selModel.lastSelected.data.leaf) {
                arbol.getSelectionModel().getLastSelected().expand();
            }
        } else
            arbol.root.load();
    }
    function formatDate(value) {
        if (value == null || value == "")
            return null
        else {
            if (value.length > 10) {
                dt = new Date(value.substring(0, 4), parseInt(value.substring(5, 7)) - 1, value.substring(8, 10));
                return Ext.Date.format(dt, 'd-m-Y');
                ;
            } else {
                dt = new Date(value);
                return Ext.Date.format(dt, 'd-m-Y');
            }

        }
    }
    var tree = Ext.create('Ext.tree.Panel', {
        store: Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: 'cargarEntidades',
                actionMethods: 'POST'
            },
            root: {
                text: 'Entidades',
                id: '0',
                expanded: true
            },
            listeners: {
                beforeload: function (th) {
                    th.proxy.extraParams.valor = Ext.getCmp('idfiltroentidad') != undefined ? Ext.getCmp('idfiltroentidad').getValue() : null;
                }

            }
        }),
        rootVisible: false,
        useArrows: true,
        autoScroll: true,
        listeners: {
            itemclick: function (t, r) {
                area = r.raw.area;
                identidadselected = r.raw.id;
                is_leaf = r.raw.leaf;
                Ext.getCmp('chartCmp').axes.items[0].maximum = parseInt(area);
                if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-0')
                    Ext.getCmp('gpPlanSiembraRotacion').getStore().load();
                else if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-1')
                    Ext.getCmp('gpActividadesEtapas').getStore().load();
                else if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-2')
                    Ext.getCmp('gpPlanProduccion').getStore().load();
                else if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-3')
                    store1.load();
                else
                    store2.load();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                items: [{
                        xtype: 'button',
                        iconCls: 'icon-expand-all',
                        tooltip: 'Expandir todas las entidades',
                        icon: perfil.dirImg + 'expand-all.gif',
                        handler: function () {
                            tree.expandAll(true);
                        }
                    }, {
                        iconCls: 'icon-collapse-all',
                        tooltip: 'Colapsar todas las entidades',
                        icon: perfil.dirImg + 'collapse-all.gif',
                        handler: function () {
                            tree.collapseAll(true);
                        }
                    }, {
                        iconCls: 'icon-collapse-all',
                        tooltip: 'Refrescar todas las entidades',
                        icon: perfil.dirImg + 'table_refresh.png',
                        handler: function () {
                            actualizarArbol(tree);
                        }
                    }, '-', {
                        xtype: 'textfield',
                        emptyText: 'Filtrar entidad...',
                        width: 90,
                        id: 'idfiltroentidad',
                        listeners: {
                            specialkey: function (t, e) {
                                if (e.getKey() == '13') {
                                    actualizarArbol(tree);
                                }
                            }
                        }
                    }]
            }]
    });

    var a = Ext.create('Ext.panel.Panel', {
        layout: 'border',
        tbar: ['->', {
                text: 'Ayuda',
                tooltip: 'Ayuda de la funcionalidad',
                disabled: false,
                id: 'btnAyu',
                icon: perfil.dirImg + 'ayuda.png',
                iconCls: 'btn'
            }],
        items: [{
                region: 'west',
                collapsible: true,
                width: 180,
                title: 'Entidades',
                frame: false,
                resizable: true,
                resizeHandles: 'e',
                layout: 'fit',
                items: tree
            }, {
                region: 'center',
                xtype: 'tabpanel',
                activeTab: 0,
                id: 'tabpanelreportes',
                listeners: {
                    tabchange: function (th, tab) {
                        if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-0') {
                            if (identidadselected != identrotacion)
                                Ext.getCmp('gpPlanSiembraRotacion').getStore().load();
                        } else if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-1') {
                            if (identidadselected != identetapa)
                                Ext.getCmp('gpActividadesEtapas').getStore().load();
                        } else if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-2') {
                            if (identidadselected != identprod)
                                Ext.getCmp('gpPlanProduccion').getStore().load();
                        } else if (Ext.getCmp('tabpanelreportes').getActiveTab().id == 'tab-3') {
                            if (identidadselected != identarea)
                                store1.load();
                        } else
                        if (identidadselected != identapro)
                            store2.load();
                    }
                },
                items: [{
                        title: 'Plan de siembra y rotaci&oacute;n de cultivos',
                        layout: 'fit',
                        id: 'tab-0',
                        items: grid
                    }, {
                        title: 'Actividades por etapas',
                        layout: 'fit',
                        id: 'tab-1',
                        items: grid3
                    }, {
                        title: 'Plan de producci&oacute;n',
                        layout: 'fit',
                        id: 'tab-2',
                        items: grid2
                    }, {
                        title: '&Aacute;rea por productos',
                        layout: 'fit',
                        id: 'tab-3',
                        tbar: ['<b>Fecha inicio: </b>'
                                    , {
                                        emptyText: 'Seleccione la fecha...',
                                        xtype: 'datefield',
                                        format: 'd/m/Y',
                                        width: 150,
                                        id: 'dffechainicioProductos'
                                    }, '-', '<b>Fecha fin: </b>'
                                    , {
                                        emptyText: 'Seleccione la fecha...',
                                        xtype: 'datefield',
                                        width: 150,
                                        format: 'd/m/Y',
                                        id: 'dffechafinProductos'
                                    }, '-', {
                                icon: perfil.dirImg + 'buscar.png',
                                iconCls: 'btn',
                                tooltip: 'Buscar  <b>(Alt + B)</b>',
                                text: 'Buscar',
                                handler: function () {
                                    store1.load();
                                }
                            }, '-', {
                                text: 'Limpiar',
                                tooltip: 'Limpiar filtro',
                                icon: perfil.dirImg + 'limpiar.png',
                                iconCls: 'btn',
                                handler: function () {
                                    Ext.getCmp('dffechainicioProductos').setValue(null);
                                    Ext.getCmp('dffechafinProductos').setValue(null);
                                    store1.load();
                                }
                            }],
                        items: {
                            xtype: 'chart',
                            id: 'chartCmp',
                            animate: true,
                            store: store1,
                            shadow: true,
                            legend: {
                                position: 'right'
                            },
                            insetPadding: 60,
                            theme: 'Base:gradients',
                            series: [{
                                    type: 'pie',
                                    field: 'area',
                                    showInLegend: true,
                                    tips: {
                                        trackMouse: true,
                                        width: 140,
                                        height: 28,
                                        renderer: function (storeItem, item) {
                                            this.setTitle(storeItem.get('denominacion') + ': ' + storeItem.get('area') + ' ha');
                                        }
                                    },
                                    highlight: {
                                        segment: {
                                            margin: 20
                                        }
                                    },
                                    label: {
                                        field: 'denominacion',
                                        display: 'rotate',
                                        contrast: true,
                                        font: '18px Arial'
                                    }
                                }]
                        }
                    }, {
                        title: 'Aprovechamiento de los suelos',
                        layout: 'fit',
                        id: 'tab-4',
                        tbar: ['->', {
                                tooltip: "Año anterior",
                                disabled: false,
                                icon: perfil.dirImg + 'anterior.png',
                                iconCls: 'btn',
                                handler: function () {
                                    annoAprovechamiento -= 1;
                                    Ext.getCmp('tbAnnoAprovechamiento').setText('<b>' + annoAprovechamiento + '</b>');
                                    store2.load();
                                }
                            }, {
                                xtype: 'tbtext',
                                text: '<b>2012</b>',
                                id: 'tbAnnoAprovechamiento'
                            }, {
                                tooltip: "Año siguiente",
                                disabled: false,
                                icon: perfil.dirImg + 'siguiente.png',
                                iconCls: 'btn',
                                handler: function () {
                                    annoAprovechamiento += 1;
                                    Ext.getCmp('tbAnnoAprovechamiento').setText('<b>' + annoAprovechamiento + '</b>');
                                    store2.load();
                                }
                            }, '->'],
                        items: {
                            id: 'chartCmp',
                            xtype: 'chart',
                            style: 'background:#fff',
                            animate: true,
                            shadow: true,
                            store: store2,
                            axes: [{
                                    type: 'Numeric',
                                    position: 'left',
                                    fields: ['area'],
                                    label: {
                                        renderer: Ext.util.Format.numberRenderer('0')
                                    },
                                    title: 'Area',
                                    grid: true,
                                    minimum: 0
                                }, {
                                    type: 'Category',
                                    position: 'bottom',
                                    fields: ['mes'],
                                    title: 'Meses del año'
                                }],
                            series: [{
                                    type: 'column',
                                    axis: 'left',
                                    highlight: true,
                                    tips: {
                                        trackMouse: true,
                                        width: 140,
                                        height: 28,
                                        renderer: function (storeItem, item) {
                                            this.setTitle(storeItem.get('mes') + ': ' + storeItem.get('area') + ' ha');
                                        }
                                    },
                                    label: {
                                        display: 'insideEnd',
                                        'text-anchor': 'middle',
                                        field: 'data1',
                                        renderer: Ext.util.Format.numberRenderer('0'),
                                        orientation: 'vertical',
                                        color: '#333'
                                    },
                                    xField: 'mes',
                                    yField: 'area'
                                }]
                        }

                    }]
            }]
    });
    Ext.create('Ext.container.Viewport', {
        renderTo: Ext.getBody(),
        layout: 'fit',
        items: [a]
    });
});
