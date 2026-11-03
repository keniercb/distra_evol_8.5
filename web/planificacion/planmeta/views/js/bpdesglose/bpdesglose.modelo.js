//Namespace del componente Desglose de niveles de actividad
Ext.ns('Planificacion.BasesDelPlan.Desglose')
//Modelo del componente Desglose de actividades
Planificacion.BasesDelPlan.Desglose.Modelo = {
    //Inicializar modelo de la vista
    init: function() {

        var vista = Planificacion.BasesDelPlan.Desglose.Vista;
        //Fuente de datos de las entidades
        this.listadoEntidades = new Ext.tree.TreeLoader({
            singleClickExpand: true,
            dataUrl: 'cargarEntidades',
            preloadChildren: false
        })

        this.listadoPlanesConfDesg = new Ext.tree.TreeLoader({
            dataUrl: 'cargarTreePanelConfDesglose',
            preloadChildren: true
        });

        this.listarPlanModelo = new Ext.tree.TreeLoader({
            dataUrl: 'listarPlanModelo',
            preloadChildren: true,
            listeners: {
                scope: this,
                load: function() {
                    if (vista.treePlanes.getRootNode().isExpanded()) {
                        vista.treePlanes.getRootNode().expandChildNodes();
                    }
                    else
                    {
                        vista.treePlanes.getRootNode().expand();
                        vista.treePlanes.getRootNode().expandChildNodes();
                    }
                }
            }
        });

        this.stGpActividadDesglose = new Ext.data.Store({
            url: 'listarDesgloseNivelesActividad',
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: "data",
                id: 'idactividadentidad'
            }, [{
                    name: 'idactividadentidad'
                }, {
                    name: 'idactividad'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'nivelactividad'
                }, {
                    name: 'denmodelo'
                }, {
                    name: 'comportamiento'
                }, {
                    name: 'idaprobacionactent'
                }, {
                    name: 'denespecialidad'
                }]),
            listeners: {
                beforeload: function() {
                },
                load: function() {
                }
            }
        });

        /******* CONFIGURACION DEL DESGLOSE ********/
        this.stConfDesglose = new Ext.data.Store({
            url: 'listarConfigDesglose',
            enableKeyEvents: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'iddesglose'
            }, [{
                    name: 'iddesglose'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }])
        });


        this.stConfNomencladores = new Ext.data.Store({
            url: 'listarDatosNomConfigDesglose',
            enableKeyEvents: true,
            listeners: {
                beforeload: function() {
                    Planificacion.BasesDelPlan.Desglose.Modelo.stConfNomencladores.baseParams.limit = 20;
                    Planificacion.BasesDelPlan.Desglose.Modelo.stConfNomencladores.baseParams.start = 0;
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idtiponomenclador'
            }, [{
                    name: 'idtiponomenclador'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'orden'
                }])
        });

        this.stNomen = new Ext.data.Store({
            url: 'listarTipoNomenclador',
            enableKeyEvents: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idtiponomenclador'
            }, [{
                    name: 'idtiponomenclador'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }])
        });

        this.stNomencladoresUsados = new Ext.data.Store({
            //url: 'listarTipoNomenclador1',
            enableKeyEvents: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idtiponomenclador'
            }, [{
                    name: 'idtiponomenclador'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'orden'
                }])
        });

        this.stCbejercicio = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
            autoLoad: true,
            listeners: {
                load: function(t, n, e) {
                    vista.cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                    Ext.Ajax.request({
                        url: 'gestPermisos',
                        params: {
                            idejercicio: vista.cbEjercicio.getValue()
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData[0]) {
                                if (responseData[0].guardar == 1) {
                                    vista.btnGuardar.show();
                                } else {
                                    vista.btnGuardar.hide();
                                }
                                if (responseData[0].insertar == 1) {
                                    vista.btnAddDesglose.show();
                                } else {
                                    vista.btnAddDesglose.hide();
                                }
                                if (responseData[0].eliminar == 1) {
                                    vista.btnDelDesglose.show();
                                    //btneliminardesglose
                                    Ext.getCmp('btneliminardesglose').show();
                                } else {
                                    vista.btnDelDesglose.hide();
                                    Ext.getCmp('btneliminardesglose').hide();
                                }
                            } else {
                                vista.btnGuardar.hide();
                                vista.btnDelDesglose.hide();
                                vista.btnAddDesglose.hide();
                                Ext.getCmp('btneliminardesglose').hide();
                            }

                        }
                    });
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'estado'
                }])
        });


    }
}

