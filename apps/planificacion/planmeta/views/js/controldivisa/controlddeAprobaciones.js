var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controldivisa', cargarInterfaz);
Ext.QuickTips.init();
function cargarInterfaz() {
//botones
    btnAsociar = new Ext.Button({
        text: 'Asociar',
        tooltip: '(Alt + K)',
        id: 'btnAsociar',
        icon: perfil.dirImg + 'buscar.png',
        iconCls: 'btn',
        handler: function() {
        }
    });
    btnDesasociar = new Ext.Button({
        text: 'Desasociar',
        tooltip: '(Alt + U)',
        id: 'btnDesasociar',
        iconCls: 'btn',
        icon: perfil.dirImg + 'buscar.png',
        handler: function() {
        }
    });
    btnLimpiar = new Ext.Button({
      //  text: '<u>L</u>impiar',
        tooltip: 'Limpiar (<b>Alt+L</b>)',
        id: 'btnLimpiar',
        iconCls: 'btn',
        icon: perfil.dirImg + 'limpiar.png',
        handler: function() {
        }
    });
    btnAyuda = new Ext.Button({
       // text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad(Alt+H)',
        id: 'btnAyuda',
        iconCls: 'btn',
        icon: perfil.dirImg + 'ayuda.png',
        handler: function() {
        }
    });
    btnPrueba = new Ext.Button({
       // text: 'Prueba',
        tooltip: 'Probando el panelito',
        id: 'btnPrueba',
        iconCls: 'btn',
        icon: perfil.dirImg + 'ayuda.png',
        handler: function() {
        }
    });
    btnPrueba1 = new Ext.Button({
       // text: 'Prueba1',
        tooltip: 'Probando el panelito',
        id: 'btnPrueba1',
        iconCls: 'btn',
        icon: perfil.dirImg + 'ayuda.png',
        handler: function() {
        }
    });

    //filtros
    //****************** filtros Indicador Control de Divisa ******************************
    contador_filter = 0;
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosIndControlDivisa = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //****************** filtros Indicador de la Planificaci�n ******************************
    contador_filter = 0;
    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosIndPlanificacion = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'codigoplanif',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string',
                dataIndex: 'nopieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }
        ]
    });
    //grid de Indicadores de Control de Divisa
    cmGpIndControlDivisa = new Ext.grid.ColumnModel([{
            header: 'C�digo',
            dataIndex: 'codigo',
            sortable: true,
            width: 100
        }, {
            id: 'expandir',
            header: 'Denominaci�n',
            sortable: true,
            dataIndex: 'denominacion'
        }]);
    stGpIndControlDivisa = new Ext.data.Store({
        url: 'listarIndicadores',
        listeners: {
            beforeload: function() {
            },
            load: function() {
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idIndControlDivisa'
        }, [{
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });

    // Selection Model grid
    smGpIndControlDivisa = new Ext.grid.RowSelectionModel({});
    // Grid gestion
    gpIndControlDivisa = new Ext.grid.GridPanel({
        store: stGpIndControlDivisa,
        plugins: filtrosIndControlDivisa,
        autoExpandColumn: 'expandir',
        sm: smGpIndControlDivisa,
        cm: cmGpIndControlDivisa,
        frame: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stGpIndControlDivisa,
            displayInfo: true
        })
    });
//grid de Indicadores de la Planificaci�n
    cmGpIndPlanificacion = new Ext.grid.ColumnModel([{
            header: 'C�digo',
            dataIndex: 'codigoplanif',
            sortable: true,
            width: 100
        }, {
            id: 'expandir',
            header: 'No Pieza',
            sortable: true,
            dataIndex: 'nopieza'
        }, {
            id: 'expandir',
            header: 'Denominaci�n',
            sortable: true,
            dataIndex: 'denominacion'
        }]);
    stGpIndPlanificacion = new Ext.data.Store({
        url: 'listarIndicadores',
        listeners: {
            beforeload: function() {
            },
            load: function() {
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idIndPlanificacion'
        }, [{
                name: 'codigoplanif'
            }, {
                name: 'nopieza'
            }, {
                name: 'denominacion'
            }])
    });

    // Selection Model grid
    smGpIndPlanificacion = new Ext.grid.RowSelectionModel({});
    // Grid gestion
    gpIndPlanificacion = new Ext.grid.GridPanel({
        store: stGpIndPlanificacion,
        plugins: filtrosIndPlanificacion,
        autoExpandColumn: 'expandir',
        sm: smGpIndPlanificacion,
        cm: cmGpIndPlanificacion,
        frame: true,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stGpIndPlanificacion,
            displayInfo: true
        })
    });
//arbol
    tpEstructura = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    tpEstructura.btnBuscar.setText("");
    tpEstructura.btnLimpiar.setText("");
    tpEstructura = tpEstructura.items.items[0];
    tpEstructura.getRootNode().expand();
    tpEstructura.region = 'north';
    tpEstructura.width = 200;
    tpEstructura.height = 150;

//paneles
    panelIzquierdoCentral = new Ext.Panel({
        title: 'Plan',
        id: 'panelIzquierdoCentral',
        region: 'center',
        titleCollapse: true,
        split: true,
        width: 200,
        height: 150
    });
    panelIzquierdoSur = new Ext.Panel({
        title: 'Destino',
        id: 'panelIzquierdoSur',
        region: 'south',
        titleCollapse: true,
        split: true,
        width: 200,
        height: 200
    });
    panelIzquierdo = new Ext.Panel({
        title: 'Entidades',
        id: 'panelIzquierdo',
        region: 'west',
        titleCollapse: true,
        split: true,
        width: 200,
        height: 500,
        items: [tpEstructura, panelIzquierdoCentral, panelIzquierdoSur]
    });
    panelCentral = new Ext.Panel({
        title: 'Indicadores de Control de Divisa',
        id: 'panelCentral',
        region: 'center',
        titleCollapse: true,
        split: true,
        width: 300,
        height: 250,
        layout: 'fit',
        items: [gpIndControlDivisa]
    });

    panelDerecho = new Ext.Panel({
        title: 'Indicadores de la Planificaci�n',
        id: 'panelDerecho',
        region: 'east',
        titleCollapse: true,
        split: true,
        width: 300,
        height: 250,
        layout: 'fit',
        items: [gpIndPlanificacion]
    });
    panelIncluyeCentro_Derecho = new Ext.Panel({
        id: 'panelIncluyeCentro_Derecho',
        region: 'center',
        titleCollapse: true,
        split: true,
        width: 600,
        height: 400,
        layout: 'border',
        tbar: [btnAsociar, btnDesasociar],
        items: [panelCentral, panelDerecho]
    });
    myView = new Ext.Viewport({
        layout: 'fit',
        items: new Ext.Panel({
            layout: 'border',
            tbar: ['->', btnLimpiar, btnAyuda],
            items: [panelIzquierdo, panelIncluyeCentro_Derecho]
        })
    });
}