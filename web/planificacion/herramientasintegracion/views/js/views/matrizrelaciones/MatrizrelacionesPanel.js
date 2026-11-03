/*
 /*
 *
 * @copyright XETID Cuba
 * @author ammejias
 * @version 1.0
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MatrizrelacionesPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    layout: 'border',
    border: false,
    region: 'center',
    initComponent: function () {
        var me = this;
        me.idCmp = this.id;
        comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizrelacionesController();
        me.etiquetas = me.controller._getLabel('Matrizrelaciones');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        //Implementar los componentes de la vista
        me.btnAyuda = new comps.buttons.btnAyuda({
            text: 'Mostrar ayuda de la funcionalidad',
            handler: function () {

            }
        });

        me.conceptoProyecto = {concepto: "DatEstudiomatrizrelacion", campoid: "idestudiomatrizrelacion", nativo: true};
        me.listProyectos = new Planificacion.Integracion.PanelProyecto({
            concepto: me.conceptoProyecto,
            region: 'center'
        });

        me.tabGeneralMatrizRelaciones = new Ext.TabPanel({
            frame: false,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: true,
            defaults: {autoScroll: true},
            items: [{
                title: me.etiquetas.lblEstudios,
                layout: 'border',
                items: me.listProyectos
            }
            ],
            listeners: {
                tabchange: function (pTabP, pTab) {
                    pTab.doLayout();
                }
            }
        });

        me.listProyectos.on('verproyecto', function (record) {
            me.verMatriz(record);
        });

        me.listProyectos.on('prueba', function (record) {
            me.controller = new Planificacion.Integracion.MatrizrelacionesController();
            //me.controller.getMatrizXProyecto({
            //    idproyectoplanificacion: 2,
            //    denominacionproyecto: record.denominacion,
            //    columnas: [{denominacion: 'Involucrado1'}, {denominacion: 'Involucrado2'}, {denominacion: 'Involucrado3'}],
            //    filas: [{
            //        denominacion: 'Actividad1',
            //        recursos: 'Hacha, Machete,Cuchillo',
            //        valor: '500', valor1: 500
            //    }, {
            //        denominacion: 'Actividad2',
            //        recursos: 'Lapiz,Papel,Boligrafos',
            //        valor: '200', valor1: 100
            //    }, {
            //        denominacion: 'Actividad3',
            //        recursos: 'Mesas,Computadoras,Sillas',
            //        valor: '600', valor1: 222
            //    }
            //    ],
            //    datos: [{"column": "Involucrado1", "row": "Actividad2", "value": "X"}, {
            //        "column": "Involucrado3",
            //        "row": "Actividad2",
            //        "value": "X"
            //    }]
            //})
            //me.controller.getMatrizHibrida({
            //    idproyectoplanificacion: 3,
            //    nombrerelacion: 'Denominaci&oacute;n',
            //    denominacionproyecto: record.denominacion,
            //    columnas: [{denominacion: 'Antecesores'}, {denominacion: 'Sucesores'}],
            //    filas: [{
            //        denominacion: 'Tarea1', codigo: 'Tarea1'
            //    }, {
            //        denominacion: 'Tarea2', codigo: 'Tarea2'
            //    }, {
            //        denominacion: 'Tarea3', codigo: 'Tarea3'
            //    }
            //    ],
            //    datos: [{
            //        "column": "Antecesores",
            //        "row": "Tarea1",
            //        "value": "Tarea2",
            //        hibrida: true
            //    },
            //        {
            //            "column": "Sucesores",
            //            "row": "Tarea2",
            //            "value": "-",
            //            hibrida: true
            //        }]
            //})
            //
            me.controller.getMatrizHibridaTareas({
                idproyectoplanificacion: 5,
                nombrerelacion: 'Actividades',
                denominacionproyecto: record.denominacion,
                columnas: [{denominacion: 'Tarea1'}, {denominacion: 'Tarea2'}, {denominacion: 'Tarea3'}],
                filas: [{
                    denominacion: 'Tarea1'
                }, {
                    denominacion: 'Tarea2'
                }, {
                    denominacion: 'Tarea3'
                }
                ],
                datos: [
                    {
                        "column": "Tarea2",
                        "row": "Tarea1",
                        "value": "X",
                    },
                    {
                        "column": "Tarea1",
                        "row": "Tarea2",
                        "value": "X"
                    },{
                        "column": "Tarea1",
                        "row": "Tarea3",
                        "value": "X"
                    }
                ]
            });

            //    me.controller.getMatrizTiempos({
            //        idproyectoplanificacion: 4,
            //        nombrerelacion: 'Tareas/Involucrados',
            //        denominacionproyecto: record.denominacion,
            //        columnas: [{denominacion: 'Involucrado1'}, {denominacion: 'Involucrado2'}, {denominacion: 'Involucrado3'}],
            //        filas: [{
            //            denominacion: 'Tarea1', codigo: 'Tarea1'
            //        }, {
            //            denominacion: 'Tarea2', codigo: 'Tarea2'
            //        }, {
            //            denominacion: 'Tarea3', codigo: 'Tarea3'
            //        }
            //        ], datos: [
            //            {"column": "Involucrado1", "row": "Tarea1", "value": "Plan/Real", hibrida: true}, {
            //                "column": "Involucrado3",
            //                "row": "Tarea1",
            //                "value": "Plan/Real", hibrida: true
            //            }]
            //    })
        });

        me.items = [me.tabGeneralMatrizRelaciones];

        Planificacion.Integracion.MatrizrelacionesPanel.superclass.initComponent.call(me);
    },
    verMatriz: function (record) {
        var me = this;
        var cmp = Ext.getCmp('GridEstudioMatrizRelaciones&' + me.id + '&' + record.idproyecto);
        if (cmp) {
            me.tabGeneralMatrizRelaciones.setActiveTab(cmp);
        } else {
            cmp = new Planificacion.Integracion.GridEstudioMatrizRelaciones({
                id: 'GridEstudioMatrizRelaciones&' + me.id + '&' + record.idproyecto,
                title: record.denominacion,
                config: {
                    createTbar: true,
                    createBbar: true,
                    editable: true,
                    idproyecto: record.idproyecto,
                    denommatrix: record.denominacion ? record.denominacion : 'new_matrix'
                },
                record: record
            });
            me.tabGeneralMatrizRelaciones.add(cmp);
            me.verMatriz(record);
        }
    }
});
Ext.reg('Planificacion.Integracion.MatrizrelacionesPanel', Planificacion.Integracion.MatrizrelacionesPanel);