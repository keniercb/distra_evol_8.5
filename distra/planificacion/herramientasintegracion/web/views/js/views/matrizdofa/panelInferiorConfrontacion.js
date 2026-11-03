/**
 * Created by Ernesto Camilo on 24/07/15.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.panelInferiorConfrontacion = ExtExtend.Class({
    $extend: Ext.Panel,
    border: false,
    layout:'border',
    region: 'center',
    initComponent: function() {
        var me = this;
        var comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');


        ////Amenazas Fortalezas///////////
        me.recAmenazasFortalezas = Ext.data.Record.create([
            {
                name: 'idestrategia'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'experto'
            }


        ]);
        me.stAmenazasFortalezas = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getlistadosbynomfactorxpares',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stAmenazasFortalezas',
                totalProperty: 'cantidad_filas'
            }, me.recAmenazasFortalezas),
            listeners: {
                load: function() {
                    var a = me.gpAmenazasFortalezas.getTopToolbar();//me.btnAdicionar.enable();
                    var btnAdicionar = a.items.items[0];
                    btnAdicionar.enable();
                }
            }


        });
        me.smAmenazasFortalezas = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, rowNumber, rec) {
                    var a = me.gpAmenazasFortalezas.getTopToolbar();//me.btnAdicionar.enable();
                    var btnEliminar = a.items.items[1];
                    btnEliminar.enable();
                },
                rowdeselect: function(sm, rowNumber, rec) {
                    if (!sm.hasSelection()) {
                        var a = me.gpAmenazasFortalezas.getTopToolbar();//me.btnAdicionar.enable();
                        var btnEliminar = a.items.items[1];
                        btnEliminar.disable();
                    }
                }
            }

        });
        me.gpAmenazasFortalezas = new Ext.grid.EditorGridPanel({
            disabled: true,
            title: me.etiquetas.amenazas + ' <-> ' + me.etiquetas.fortalezas,
            height:260,
            autoScroll: true,
            store: me.stAmenazasFortalezas,
            sm: me.smAmenazasFortalezas,
            loadMask: {msg: 'Cargando...'},
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            viewConfig: {
                forceFit: true,
                enableRowBody: true,
                getRowClass: function(record) {
                    //Variable para alamacenar el nombre de la clase CSS
                    var css = '';
                    var bandera = false;
                    if (record.data.experto==false) {
                        css = 'x-grid-cell-celda';

                    }
                    return css;
                }
            },
            cm: new Ext.grid.ColumnModel([
                {hidden: true, dataIndex: 'idestrategia'},
                {header: me.etiquetas.denomEstrategia, dataIndex: 'denominacion', width: 200, editor: new comps.fields.fieldDenom}
            ]),
            tbar: [
                new comps.buttons.btnAdicionar({
                    handler: function() {
                        var rec = new me.recAmenazasFortalezas({
                            idestrategia: '',
                            denominacion: ''
                        });
                        me.stAmenazasFortalezas.insert(0, rec);
                        this.disable();
                    }
                }),
                new comps.buttons.btnEliminar({
                    disabled: true,
                    handler: function() {
                        me.controller._insertItem('gpEstrategias', me.gpAmenazasFortalezas);
                        me.controller.eliminarEstrategia();
                    }
                })
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: me.stAmenazasFortalezas
                //displayInfo: true,
                //start: 0,
                //limit: 5
            }),
            listeners: {
                afteredit: function(e) {
                    if (e.record.data.denominacion != '') {
                        me.controller._insertItem('gpEstrategias', me.gpAmenazasFortalezas);
                        me.variables['idfactorclave1'] = 4;
                        me.variables['idfactorclave2'] = 3;
                        me.variables['analista'] = me.analista;
                        me.controller.guardarDatosEstrategia(me.variables);
                    }
                }
            }
        });
        //// Fin Amenazas Fortalezas///////////

        ////Amenazas Debilidades///////////
        me.recAmenazasDebilidades = Ext.data.Record.create([
            {
                name: 'idestrategia'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'experto'
            }


        ]);
        me.stAmenazasDebilidades = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getlistadosbynomfactorxpares',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stAmenazasDebilidades',
                totalProperty: 'cantidad_filas'
            }, me.recAmenazasDebilidades),
            listeners: {
                load: function() {
                    var a = me.gpAmenazasDebilidades.getTopToolbar();//me.btnAdicionar.enable();
                    var btnAdicionar = a.items.items[0];
                    btnAdicionar.enable();
                }
            }


        });
        me.smAmenazasDebilidades = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, rowNumber, rec) {
                    var a = me.gpAmenazasDebilidades.getTopToolbar();//me.btnAdicionar.enable();
                    var btnEliminar = a.items.items[1];
                    btnEliminar.enable();
                },
                rowdeselect: function(sm, rowNumber, rec) {
                    if (!sm.hasSelection()) {
                        var a = me.gpAmenazasDebilidades.getTopToolbar();//me.btnAdicionar.enable();
                        var btnEliminar = a.items.items[1];
                        btnEliminar.disable();
                    }
                }
            }

        });
        me.gpAmenazasDebilidades = new Ext.grid.EditorGridPanel({
            disabled: true,
            title: me.etiquetas.amenazas + ' <-> ' + me.etiquetas.debilidades,
            height: 260,
            autoScroll: true,
            store: me.stAmenazasDebilidades,
            sm: me.smAmenazasDebilidades,
            loadMask: {msg: 'Cargando...'},
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            viewConfig: {
                forceFit: true,
                enableRowBody: true,
                getRowClass: function (record) {
                    //Variable para alamacenar el nombre de la clase CSS
                    var css = '';
                    var bandera = false;
                    if (record.data.experto == false) {
                        css = 'x-grid-cell-celda';

                    }
                    return css;
                }
            },
            cm: new Ext.grid.ColumnModel([
                {hidden: true, dataIndex: 'idestrategia'},
                {header: me.etiquetas.denomEstrategia, dataIndex: 'denominacion', width: 200, editor: new comps.fields.fieldDenom}
            ]),
            tbar: [
                new comps.buttons.btnAdicionar({
                    handler: function() {
                        var rec = new me.recAmenazasDebilidades({
                            idestrategia: '',
                            denominacion: ''
                        });
                        me.stAmenazasDebilidades.insert(0, rec);
                        this.disable();
                    }
                }),
                new comps.buttons.btnEliminar({
                    disabled: true,
                    handler: function() {
                        me.controller._insertItem('gpEstrategias', me.gpAmenazasDebilidades);
                        me.controller.eliminarEstrategia();
                    }
                })
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: me.stAmenazasDebilidades
                //displayInfo: true,
                //start: 0,
                //limit: 5
            }),
            listeners: {
                afteredit: function(e) {
                    if (e.record.data.denominacion != '') {
                        me.controller._insertItem('gpEstrategias', me.gpAmenazasDebilidades);
                        me.variables['idfactorclave1'] = 4;
                        me.variables['idfactorclave2'] = 1;
                        me.variables['analista'] = me.analista;
                        me.controller.guardarDatosEstrategia(me.variables);
                    }
                }
            }

        });
        //// Fin Amenazas Debilidades///////////

        ////Oportunidades Fortalezas///////////
        me.recOportunidadesFortalezas = Ext.data.Record.create([
            {
                name: 'idestrategia'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'experto'
            }


        ]);
        me.stOportunidadesFortalezas = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getlistadosbynomfactorxpares',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stOportunidadesFortalezas',
                totalProperty: 'cantidad_filas'
            }, me.recOportunidadesFortalezas),
            listeners: {
                load: function() {
                    var a = me.gpOportunidadesFortalezas.getTopToolbar();//me.btnAdicionar.enable();
                    var btnAdicionar = a.items.items[0];
                    btnAdicionar.enable();
                }
            }


        });
        me.smOportunidadesFortalezas = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, rowNumber, rec) {
                    var a = me.gpOportunidadesFortalezas.getTopToolbar();//me.btnAdicionar.enable();
                    var btnEliminar = a.items.items[1];
                    btnEliminar.enable();
                },
                rowdeselect: function(sm, rowNumber, rec) {
                    if (!sm.hasSelection()) {
                        var a = me.gpOportunidadesFortalezas.getTopToolbar();//me.btnAdicionar.enable();
                        var btnEliminar = a.items.items[1];
                        btnEliminar.disable();
                    }
                }
            }

        });
        me.gpOportunidadesFortalezas = new comps.containers.grids.rowEditorGrid({
            disabled: true,
            title: me.etiquetas.oportunidades + ' <-> ' + me.etiquetas.fortalezas,
            height: 260,
            autoScroll: true,
            store: me.stOportunidadesFortalezas,
            sm: me.smOportunidadesFortalezas,
            loadMask: {msg: 'Cargando...'},
            cm: new Ext.grid.ColumnModel([
                {hidden: true, dataIndex: 'idestrategia'},
                {header: me.etiquetas.denomEstrategia, dataIndex: 'denominacion', width: 200, editor: new comps.fields.fieldDenom}
            ]),
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            viewConfig: {
                forceFit: true,
                enableRowBody: true,
                getRowClass: function (record) {
                    //Variable para alamacenar el nombre de la clase CSS
                    var css = '';
                    var bandera = false;
                    if (record.data.experto == false) {
                        css = 'x-grid-cell-celda';

                    }
                    return css;
                }
            },
            //tbar: [
            //    new comps.buttons.btnAdicionar({
            //        handler: function() {
            //            var rec = new me.recOportunidadesFortalezas({
            //                idestrategia: '',
            //                denominacion: ''
            //            });
            //            me.stOportunidadesFortalezas.insert(0, rec);
            //            this.disable();
            //        }
            //    }),
            //    new comps.buttons.btnEliminar({
            //        disabled: true,
            //        handler: function() {
            //            me.controller._insertItem('gpEstrategias', me.gpOportunidadesFortalezas);
            //            me.controller.eliminarEstrategia();
            //        }
            //    })
            //],
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: me.stOportunidadesFortalezas
                //displayInfo: true
            }),
            listeners: {
                'afteredit': function(e) {
                    if (e.record.data.denominacion != '') {
                        me.controller._insertItem('gpEstrategias', me.gpOportunidadesFortalezas);
                        me.variables['idfactorclave1'] = 2;
                        me.variables['idfactorclave2'] = 3;
                        me.variables['analista'] = me.analista;
                        me.controller.guardarDatosEstrategia(me.variables);
                    }
                }
            }

        });
        //// Fin Oportunidades Fortalezas///////////

        ////Oportunidades Debilidades///////////
        me.recOportunidadesDebilidades = Ext.data.Record.create([
            {
                name: 'idestrategia'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'experto'
            }

        ]);
        me.stOportunidadesDebilidades = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getlistadosbynomfactorxpares',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stOportunidadesDebilidades',
                totalProperty: 'cantidad_filas'
            }, me.recOportunidadesDebilidades),
            listeners: {
                load: function() {
                    var a = me.gpOportunidadesDebilidades.getTopToolbar();//me.btnAdicionar.enable();
                    var btnAdicionar = a.items.items[0];
                    btnAdicionar.enable();
                }
            }


        });
        me.smOportunidadesDebilidades = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, rowNumber, rec) {
                    var a = me.gpOportunidadesDebilidades.getTopToolbar();//me.btnAdicionar.enable();
                    var btnEliminar = a.items.items[1];
                    btnEliminar.enable();
                },
                rowdeselect: function(sm, rowNumber, rec) {
                    if (!sm.hasSelection()) {
                        var a = me.gpOportunidadesDebilidades.getTopToolbar();//me.btnAdicionar.enable();
                        var btnEliminar = a.items.items[1];
                        btnEliminar.disable();
                    }
                }
            }

        });
        me.gpOportunidadesDebilidades = new Ext.grid.EditorGridPanel({
            disabled: true,
            title: me.etiquetas.oportunidades + ' <-> ' + me.etiquetas.debilidades,
            height: 260,
            autoScroll: true,
            store: me.stOportunidadesDebilidades,
            sm: me.smOportunidadesDebilidades,
            loadMask: {msg: 'Cargando...'},
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            viewConfig: {
                forceFit: true,
                enableRowBody: true,
                getRowClass: function (record) {
                    //Variable para alamacenar el nombre de la clase CSS
                    var css = '';
                    var bandera = false;
                    if (record.data.experto == false) {
                        css = 'x-grid-cell-celda';

                    }
                    return css;
                }
            },
            cm: new Ext.grid.ColumnModel([
                {hidden: true, dataIndex: 'idestrategia'},
                {header: me.etiquetas.denomEstrategia, dataIndex: 'denominacion', width: 200, editor: new comps.fields.fieldDenom}
            ]),
            tbar: [
                new comps.buttons.btnAdicionar({
                    handler: function() {
                        var rec = new me.recOportunidadesDebilidades({
                            idestrategia: '',
                            denominacion: ''
                        });
                        me.stOportunidadesDebilidades.insert(0, rec);
                        this.disable();
                    }
                }),
                new comps.buttons.btnEliminar({
                    disabled: true,
                    handler: function() {
                        me.controller._insertItem('gpEstrategias', me.gpOportunidadesDebilidades);
                        me.controller.eliminarEstrategia();
                    }
                })
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: me.stOportunidadesDebilidades
                //displayInfo: true,
                //displayMsg: 'Mostrando de {0} - {1} de {2}',
                //emptyMsg: "No hay resultados para mostrar."
            }),
            listeners: {
                afteredit: function(e) {
                    if (e.record.data.denominacion != '') {
                        me.controller._insertItem('gpEstrategias', me.gpOportunidadesDebilidades);
                        me.variables['idfactorclave1'] = 2;
                        me.variables['idfactorclave2'] = 1;
                        me.variables['analista'] = me.analista;
                        me.controller.guardarDatosEstrategia(me.variables);
                    }
                }
            }
        });
        //// Fin Oportunidades Debilidades///////////
        var panelAmenazas = new Ext.Panel({
            region:'north',
            height:270,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            layout: 'form',
                            columnWidth: 0.5,
                            style: 'marginTop:10px',
                            items: [me.gpAmenazasFortalezas]
                        },
                        {
                            layout: 'form',
                            columnWidth: 0.5,
                            style: 'margin:10px 0 0 10px',
                            items: [me.gpAmenazasDebilidades]
                        }
                    ]
                }
            ],
            listeners: {
                collapse: function() {
                    panelOportunidades.expand();
                }
            }
        });
        var panelOportunidades = new Ext.Panel({
            region:'center',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            layout: 'form',
                            columnWidth: 0.5,
                            style: 'marginTop:10px',
                            items: [me.gpOportunidadesFortalezas]
                        },
                        {
                            layout: 'form',
                            columnWidth: 0.5,
                            style: 'margin:10px 0 0 10px',
                            items: [me.gpOportunidadesDebilidades]
                        }
                    ]

                }
            ],
            listeners: {
                expand: function(panel) {
                    var b = panel.getSize();
                    var a = me.gpOportunidadesFortalezas.getSize();
                    var c = me.gpOportunidadesDebilidades.getSize();
                    me.gpOportunidadesFortalezas.setSize(b.width / 2, a.height);
                    me.gpOportunidadesDebilidades.setSize(b.width / 2 - 5, c.height);
                },
                collapse: function() {
                    panelAmenazas.expand();
                }

            }
        });

        var panelGeneral = new Ext.Panel({
            region:'center',
            layout: 'border',
            items: [
                panelAmenazas,
                panelOportunidades
            ]
        });

        me.items = [
            panelGeneral
        ];


        Planificacion.Integracion.panelInferiorConfrontacion.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.panelInferiorConfrontacion', Planificacion.Integracion.panelInferiorConfrontacion);