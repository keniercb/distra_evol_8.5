var perfil = eval(uneval(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('controlejecucionplanifproducciones', cargarInterfaz);
var offsetAct = 0;


function cargarInterfaz() {
    //combo ejercicio
    stCbejercicio = new Ext.data.Store({
        url: 'cargarEjercicios',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function(t, n, e) {
                cmbEjercicio.setValue(t.data.items[0].id);
            }
        }
    });
    cmbEjercicio = new Ext.form.ComboBox({
        width: 150,
        id: 'idejercicioplanif',
        store: stCbejercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        disabled: false,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function() {
            }
        }
    });

    //panel de estructuras
    tpEntidades = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false,
                width: 600
            });
    tpEntidades.btnBuscar.setText("");
    tpEntidades.btnLimpiar.setText("");
    tpEntidades = tpEntidades.items.items[0];
    tpEntidades.getRootNode().expand();
    tpEntidades.region = 'west';
    tpEntidades.addListener('click', function(n) {
    });

    //grid de niveles de actividad
    smNivelesActividadesEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, rowIndex, rec) {
            },
            rowdeselect: function(x, y, w) {
            }
        }
    });
    cmNivelesActividadesEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            dataIndex: 'codigo',
            width: 150,
            sortable: true
        }, {
            header: perfil.etiquetas.lbDenominacion,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            width: 300,
            sortable: true,
            id: 'expandir'
        }, {
            header: perfil.etiquetas.lbNAP,
            tooltip: perfil.etiquetas.lbNAP,
            dataIndex: 'nivelactividadproducciones',
            width: 150,
            sortable: true
        }, {
            header: perfil.etiquetas.lbNAIP,
            tooltip: perfil.etiquetas.lbNAIP,
            dataIndex: 'nivelactividadindependientedelasproducciones',
            width: 150,
            sortable: true
        }, {
            header: perfil.etiquetas.lbNAT,
            tooltip: perfil.etiquetas.lbNAT,
            dataIndex: 'nivelactividadtotal',
            width: 150,
            sortable: true
        }, {
            header: perfil.etiquetas.lbRA,
            tooltip: perfil.etiquetas.lbRA,
            dataIndex: 'nivelactvreal',
            width: 150,
            sortable: true
        }, {
            header: perfil.etiquetas.lbP,
            tooltip: perfil.etiquetas.lbP,
            dataIndex: 'pendiente',
            width: 150,
            sortable: true
        }
    ]);
    filtrosNivelesActividadesEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                anchor: '95%',
                fieldLabel: '',
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadproducciones'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadindependientedelasproducciones'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividadtotal'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactvreal'
            }, {
                type: 'numeric',
                dataIndex: 'pendiente'
            }]
    });
    stNivelesActividadesEjecucionPlanif = new Ext.data.Store({
        url: 'listarNivelesAct',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idactividad'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'nivelactividadproducciones'
            }, {
                name: 'nivelactividadindependientedelasproducciones'
            }, {
                name: 'nivelactividadtotal'
            }, {
                name: 'nivelactvreal'
            }, {
                name: 'pendiente'
            }
        ]),
        listeners: {
            beforeload: function(st, op) {
            },
            load: function(st, rec, op) {
            }
        }
    });
    gpNivelesActividadesEjecucionPlanif = new Ext.grid.GridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        plugins: filtrosNivelesActividadesEjecucionPlanif,
        enableKeyEvents: true,
        autoExpandColumn: 'expandir',
        store: stNivelesActividadesEjecucionPlanif,
        sm: smNivelesActividadesEjecucionPlanif,
        cm: cmNivelesActividadesEjecucionPlanif,
        region: 'center',
        loadMask: {
            store: stNivelesActividadesEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stNivelesActividadesEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosNivelesActividadesEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetAct = e.start;
                }
            }
        })
    });

    //grid de control de niveles de actividad
    smActividadesRealPorFechaEjecucionPlanif = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
            },
            rowdeselect: function() {
            }
        }
    });

    dtRealPorFechaEjecActv = new Ext.form.DateField({
        format: 'd/m/Y',
        id: 'iddtRealPorFechaEjecActv',
        anchor: '95%',
        allowBlank: false,
        value: new Date().format('d/m/Y')
    });


    cmActividadesRealPorFechaEjecucionPlanif = new Ext.grid.ColumnModel([
        {
            header: perfil.etiquetas.lbCantidad,
            tooltip: perfil.etiquetas.lbCantidad,
            dataIndex: 'nivelactividadreal',
            width: 300,
            sortable: true,
            editor: new Ext.form.NumberField({
                allowBlank: false
            })
        }, {
            header: perfil.etiquetas.lbFecha,
            tooltip: perfil.etiquetas.lbFecha,
            dataIndex: 'fechareal',
            width: 300,
            sortable: true,
            renderer: formatDate,
            editor: dtRealPorFechaEjecActv
        }
    ]);

    filtrosActividadesRealPorFechaEjecucionPlanif = new Ext.grid.GridFilters({
        filters: [{
                type: 'numeric',
                dataIndex: 'nivelactividadreal'
            }, {
                type: 'date',
                dataIndex: 'fechareal'
            }]
    });

    stActividadesRealPorFechaEjecucionPlanif = new Ext.data.Store({
        url: 'listarEjecucionNiveles',
        auotLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'nivelactividadreal'
            }, {
                name: 'fechareal'
            }
        ]),
        listeners: {
            beforeload: function(st) {
            }
        }
    });

    btnAdicionarDesgActv = new Ext.Button({
        tooltip: 'Adicionar Extra plan',
        iconCls: 'adicionar',
        disabled: true,
        handler: function() {
            adicionarFilaDesgActv();
        }
    });

    btnGuardarDesgActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        iconCls: 'guardar',
        disabled: true,
        handler: function() {
            guardarFilaDesgActv();
        }
    });

    btnEliminarDesgActv = new Ext.Button({
        tooltip: 'Sustituci&oacute;n',
        id: 'idbtnEliminarDesgAct',
        iconCls: 'eliminar',
        disabled: true,
        handler: function() {
            eliminarEjecActv();
        }
    });

    gpActividadesRealPorFechaEjecucionPlanif = new Ext.grid.EditorGridPanel({
        frame: true,
        width: '100%',
        height: '50%',
        border: false,
        autoScroll: true,
        disable: false,
        clicksToEdit: 2,
        enableKeyEvents: true,
        store: stActividadesRealPorFechaEjecucionPlanif,
        sm: smActividadesRealPorFechaEjecucionPlanif,
        cm: cmActividadesRealPorFechaEjecucionPlanif,
        plugins: filtrosActividadesRealPorFechaEjecucionPlanif,
        region: 'center',
        tbar: [btnAdicionarDesgActv, btnGuardarDesgActv, btnEliminarDesgActv],
        loadMask: {
            store: stActividadesRealPorFechaEjecucionPlanif
        },
        bbar: new Ext.PagingToolbar({
            store: stActividadesRealPorFechaEjecucionPlanif,
            displayInfo: true,
            items: ['-', {
                    xtype: 'button',
                    iconCls: 'limpiar',
                    tooltip: 'Limpiar',
                    handler: function() {
                        filtrosActividadesRealPorFechaEjecucionPlanif.clearFilters();
                    }
                }],
            listeners: {
                beforechange: function(p, e) {
                    offsetActEjec = e.start;
                }
            }
        }),
        listeners: {
            afteredit: function(obj) {
                btnAdicionarDesgActv.enable();
                btnEliminarDesgActv.disable();
                var filasmodificadas = [];
                filasmodificadas = obj.grid.getStore().getModifiedRecords();
                for (var j = 0; j < filasmodificadas.length; j++) {
                    if (filasmodificadas[j].data.cantidadreal != '' || filasmodificadas[j].data.cantidadreal == 0) {
                        btnGuardarDesgActv.enable();
                        break;
                    }
                }
            }
        }
    });
}
function formatDate(value) {
    if (Ext.isDate(value)) {
        return value.format('d/m/Y');
    } else {
        return value;
    }
}