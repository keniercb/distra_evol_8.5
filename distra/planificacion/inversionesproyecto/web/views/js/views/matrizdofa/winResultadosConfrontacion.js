/**
 * Created by Ernesto Camilo on 29/06/15.
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.gpEstrategias = ExtExtend.Class({
    $extend: Ext.Panel,
    border: true,
    frame: true,
    layout: 'border',
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.delEstrategias = [];
        comps.plugins.grid.checkColumn
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.idmatrizdofa = this.idmatrizdofa;
        me.etiquetas = this.etiquetas;
        me.directorioImagenes = this.dirImg;

        me.recordEstrategias1 = Ext.data.Record.create([
            {name: 'idestrategia'},
            {name: 'experto'},
            {name: 'denominacion'},
            {name: 'tipo'},
        ]);
        me.stEstrategias1 = new Ext.data.GroupingStore({
            baseParams: {
                start: 0,
                limit: 10,
                idmatrizdofa: me.idmatrizdofa
            },
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getestrategias',
            reader: new Ext.data.JsonReader({
                root: 'root',
                totalProperty: 'cantidad_filas'
            }, me.recordEstrategias1),
            groupField: 'tipo',
            sortInfo: {field: 'idestrategia', direction: "ASC"},
            listeners: {
                'beforeload': function () {
                    return false;
                }
            }
        });
        me.stEstrategias = new Ext.data.JsonStore({
            baseParams: {
                start: 0,
                limit: 10,
                idmatrizdofa: me.idmatrizdofa
            },
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getestrategias',
            totalProperty: 'cantidad_filas',
            root: 'root', fields: [],
            listeners: {
                'beforeload': function () {
                    return false;
                }
            }
        });


        me.smEstrategia = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (el) {
                    if (el.hasSelection()) {
                        me.btnAdicionar.enable();
                    } else {
                        me.btnAdicionar.disable();
                    }
                }
            }

        });
//----------------------Relacionar--------------------------------------- 

        me.btnAdicionar = new Ext.Button({
            icon: perfil.dirImg + 'siguiente.png',
            tooltip: me.etiquetas.ttpiBtnAdicionar,
            iconCls: 'btn',
            disabled: true,
            handler: function () {
                me.smEstrategia.each(function (item) {
                    me.delEstrategias.remove(item.data);
                    me.storden.add(item);
                });
                me.btnAdicionar.disable();
            }

        });
        me.btnSubir = new Ext.Button({
            icon: perfil.dirImg + 'arriba.png',
            tooltip: me.etiquetas.ttpiBtnAdicionar,
            iconCls: 'btn',
            disabled: true,
            handler: function () {

            }

        });

        me.btnEliminar = new Ext.Button({
            iconCls: 'btn',
            icon: perfil.dirImg + 'anterior.png',
            tooltip: me.etiquetas.ttipBtnEliminar,
            hidden: false,
            disabled: true,
            handler: function () {
                me.smGporden.each(function (item) {
                    var bol = false;
                    if (item.get('orden')) {
                        if (me.delEstrategias.length == 0) {
                            bol = true;
                        } else {
                            Ext.each(me.delEstrategias, function (item1) {
                                if (item.get('idestrategia') !== item1.idestrategia) {
                                    bol = true;
                                }
                            })
                        }
                    }
                    if (bol) {
                        me.delEstrategias.push(item.data);
                    }
                    me.storden.remove(item);
                });
                me.btnEliminar.disable();
                console.info(me.delEstrategias)
            }
        });
        me.btnBajar = new Ext.Button({
            iconCls: 'btn',
            icon: perfil.dirImg + 'abajo.png',
            tooltip: me.etiquetas.ttipBtnEliminar,
            hidden: false,
            disabled: true,
            handler: function () {
            }
        });

        me.panelOperaciones = new Ext.Panel({
            region: 'east',
            frame: true,
            height: '100%',
            width: 38,
            border: false,
            layout: 'form',
            bodyStyle: 'margin-top:80px',
            //title: ' ',
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: '100%',
                        width: 30
                    },
                        me.btnAdicionar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: '100%',
                        width: 30
                    },
                        me.btnEliminar
                    ]
                }
            ]
        });
//-----------------------------------------------------------------------------------------------------------


        me.gpEstrategias = new Ext.grid.LockingEditorGridPanel({
            region: 'center',
            id: 'gpEstrategias',
            ddGroup: 'secondGridDDGroup',
            title: 'Listado de estrategias y criterio por especialistas',
            autoScroll: true,
            clicksToEdit: 1,
            columnLines: true,
            border: true,
            store: me.stEstrategias1,
            columns: [],
            width: '72%',
            sm: me.smEstrategia,
            enableDragDrop: true,
            stripeRows: true,
            loadMask: true,
            plugins: [],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{gvalue} ({[values.rs.length]} {[values.rs.length > 1 ? " estrategias " : " estrategia "]})'
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: me.stEstrategias1,
                displayInfo: true,
                displayMsg: 'Mostrando de {0} - {1} de {2}',
                emptyMsg: "No hay resultados para mostrar."
            }),
            listeners: {
                afteredit: function (e) {
                    var record = {
                        idestrategia: e.record.data.idestrategia,
                        idcriterio: e.field
                    };
                    if (e.value) {
                        me.controller.guardarCruce({record: record, accion: 'ins'});
                    }
                    else {
                        me.controller.guardarCruce({record: record, accion: 'del'});
                    }
                    e.record.commit();
                }
            }
        });

        me.recOrdenadas = Ext.data.Record.create([
            {
                name: 'idestrategia'
            },
            {
                name: 'orden'
            },
            {
                name: 'denominacion'
            }
        ]);
        me.storden = new Ext.data.Store({
            baseParams: {
                start: 0,
                limit: 10,
                idmatrizdofa: me.idmatrizdofa,
                orden: true
            },
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getestrategias',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stFactores',
                totalProperty: 'cantidad_filas'
            }, me.recOrdenadas), listeners: {
                load: function (th) {
                    me.delEstrategias = [];
                }
            }


        });
        me.storden.load();
        me.cols = [
            {id: 'name', header: me.etiquetas.estrategias, width: 160, sortable: true, dataIndex: 'denominacion'}
        ];
        me.smGporden = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (el) {
                    if (el.hasSelection()) {
                        me.btnEliminar.enable();
                    } else {
                        me.btnEliminar.disable();
                    }
                }
            }

        });
        me.gporden = new Ext.grid.GridPanel({
            id: 'gporden',
            store: me.storden,
            region: 'center',
            ddGroup: 'dd',
            columns: me.cols,
            enableDragDrop: true,
            stripeRows: true,
            loadMask: {msg: 'Cargando...'},
            autoExpandColumn: 'name',
            sm: me.smGporden,
            listeners: {
                "render": {
                    scope: this,
                    fn: function (grid) {

                        var ddrow = new Ext.dd.DropTarget(grid.container, {
                            ddGroup: 'dd',
                            copy: false,
                            notifyDrop: function (dd, e, data) {
                                var ds = grid.getStore();

                                // NOTE:
                                // you may need to make an ajax call
                                // here
                                // to send the new order
                                // and then reload the store


                                // alternatively, you can handle the
                                // changes
                                // in the order of the row as
                                // demonstrated below

                                // ***************************************

                                var sm = grid.getSelectionModel();
                                var rows = sm.getSelections();
                                if (dd.getDragData(e)) {
                                    var cindex = dd.getDragData(e).rowIndex;
                                    if (typeof(cindex) != "undefined") {
                                        for (i = 0; i < rows.length; i++) {
                                            ds.remove(ds.getById(rows[i].id));
                                        }
                                        ds.insert(cindex, data.selections);
                                        sm.clearSelections();
                                    }
                                }
                            }
                        })
                        //grid.getView().refresh(true);
                    }
                }
            }
        });

        me.westpanel = new Ext.Panel({
            title: me.etiquetas.estrategiasOrdenadas,
            region: 'east',
            layout: 'border',
            width: '30%',
            collapsible: true,
            items: [me.gporden]
        });
        me.centerpanel = new Ext.Panel({
            region: 'center',
            layout: 'border',
            items: [me.panelOperaciones, me.gpEstrategias]
        });

        me.on('render', function () {
            me.mostrarMatriz();
        });
        me.items = [me.westpanel, me.centerpanel];
        Planificacion.Integracion.gpEstrategias.superclass.initComponent.call(me);
    },
    mostrarMatriz: function () {
        var me = this;
        me.controller._insertItem('objeto', me);
        me.controller.obtenerConfiguracionMatrizDofa(me.idmatrizdofa);

    },
    datosgrid: function (c, metaData, record, rowIndex, colIndex, store) {
        if (c)
            return '<b>X</b>';
        else
            return '<b>-</b>';
    },
    reconfigureGrid: function (items) {
        var me = this;
        var st = me.gpEstrategias.getStore();
        var col = [
            {
                header: "<b>" + items[1].header + "</b>",
                locked: true,
                hideable: false,
                menuDisabled: true,
                dataIndex: items[1].name,
                width: 180,
                id: 'colEstrategias'
            }
        ];
        for (var i = 2; i < items.length; i++) {
            if (items[i].name == 'tipo') {
                column = {header: "", width: 20, hidden: true, hideable: false, sortable: true, dataIndex: 'tipo'};
            } else {
                column = {
                    header: "<b>" + items[i].header + "</b>",
                    hideable: false,
                    dataIndex: items[i].name,
                    menuDisabled: true,
                    align: 'center',
                    editable: true,
                    sortable: true,
                    editor: new Ext.form.Checkbox({
                        ctCls: 'center-check-editor',
                        listeners: {
                            check: function (cb, checked) {
                                cb.fireEvent('blur', {});
                            }
                        }
                    }),
                    width: 100,
                    tooltip: items[i].descripcion,
                    renderer: me.datosgrid
                };
            }

            col.push(column);
        }
        var arreglo = [];
        Ext.each(items, function (item) {
            arreglo.push({name: item.name, type: 'auto', sortDir: 'ASC'});
        });
        me.recordEstrategias1 = Ext.data.Record.create(arreglo);
        me.stEstrategias1 = new Ext.data.GroupingStore({
            url: st.url,
            reader: new Ext.data.JsonReader({
                root: 'root',
                totalProperty: 'cantidad_filas'
            }, me.recordEstrategias1),
            sortInfo: {field: 'idestrategia', direction: "ASC"},
            groupField: 'tipo',
            listeners: {
                'load': function (store, rec, options) {
                    me.gpEstrategias.getView().refresh();
                }
            }
        });

        me.stEstrategias = new Ext.data.JsonStore({
            url: st.url,
            totalProperty: st.totalProperty,
            root: st.root,
            fields: items,
            listeners: {
                'load': function (store, rec, options) {
                    me.gpEstrategias.getView().refresh();
                }
            }
        });
        var columnas = new Ext.grid.LockingColumnModel(col);
        me.gpEstrategias.reconfigure(me.stEstrategias1, columnas);
        me.stEstrategias1.load({
            params: {
                idmatrizdofa: me.idmatrizdofa,
                start: 0,
                limit: 10
            }
        });
    }


});
Ext.reg('Planificacion.Integracion.gpEstrategias', Planificacion.Integracion.gpEstrategias);


Planificacion.Integracion.winResultadosConfrontacion = ExtExtend.Class({
    $extend: ExtExtend.Components.containers.windows.GWindow,
    controller: this.controller,
    width: 800,
    height: 500,
    modal: true,
    layout: 'border',
    closeAction: 'destroy',
    resizable: true,
    maximizable: true,
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.title = me.etiquetas.resultadosConf;


        me.gpEstrategias = new Planificacion.Integracion.gpEstrategias({
            idmatrizdofa: me.idmatrizdofa,
            etiquetas: me.etiquetas,
            cls: 'x-toolbar',
            arreglo: me.arreglo,
            region: 'center'
        });

        me.btnExportar = new comps.buttons.btnExportar({
            tooltip: 'Exportar estrategias ordenadas',
            handler: function () {
                var exportar = new Planificacion.Integracion.ExportarWindow({
                    controller: me.controller,
                    closable: true,
                    storden: me.gpEstrategias.storden.data
                });
                exportar.show();
            }
        });
        me.btnGuardar = new comps.buttons.btnGuardar({
            handler: function () {
                if (me.gpEstrategias.storden.data.length > 0 || me.gpEstrategias.delEstrategias.length > 0) {
                    me.controller.guardarEstrategiaOrdenadas({
                        datos: me.gpEstrategias.storden.data,
                        eliminadas: me.gpEstrategias.delEstrategias,
                        st: me.gpEstrategias.storden,
                        id: me.idmatrizdofa
                    });
                }
            }
        });
        me.btnCerrar = new comps.buttons.btnCerrar({
            handler: function () {
                me.close();
            }.createDelegate(this)
        });

        me.items = [me.gpEstrategias];
        me.tbar = ['->', me.btnExportar];
        me.buttons = [me.btnCerrar, me.btnGuardar];
        me.keys = [
            {
                key: 'e',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnExportar.handler.call();
                }
            }
        ];
        Planificacion.Integracion.winResultadosConfrontacion.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.winResultadosConfrontacion', Planificacion.Integracion.winResultadosConfrontacion);